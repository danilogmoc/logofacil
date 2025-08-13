import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, TrendingUp, Calculator, Zap, RefreshCw } from 'lucide-react'
import './App.css'

function App() {
  const [numDozens, setNumDozens] = useState(15)
  const [generatedGames, setGeneratedGames] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [statistics, setStatistics] = useState(null)

  // Função para verificar se um número é Fibonacci
  const isFibonacci = (n) => {
    let a = 0, b = 1
    while (a < n) {
      [a, b] = [b, a + b]
    }
    return a === n
  }

  // Função para contar números Fibonacci
  const countFibonacci = (numbers) => {
    return numbers.filter(n => isFibonacci(n)).length
  }

  // Função para contar números da moldura
  const countBorderNumbers = (numbers) => {
    const borderNumbers = new Set([1, 2, 3, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 23, 24, 25])
    return numbers.filter(n => borderNumbers.has(n)).length
  }

  // Função para contar pares e ímpares
  const countEvenOdd = (numbers) => {
    const even = numbers.filter(n => n % 2 === 0).length
    const odd = numbers.length - even
    return { even, odd }
  }

  // Função para verificar sequências longas
  const hasLongSequence = (numbers, maxLength = 5) => {
    let currentLength = 1
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] === numbers[i-1] + 1) {
        currentLength++
        if (currentLength >= maxLength) return true
      } else {
        currentLength = 1
      }
    }
    return false
  }

  // Função para gerar um jogo
  const generateGame = () => {
    const numbers = []
    const availableNumbers = Array.from({length: 25}, (_, i) => i + 1)
    
    // Selecionar números aleatoriamente
    for (let i = 0; i < numDozens; i++) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length)
      numbers.push(availableNumbers.splice(randomIndex, 1)[0])
    }
    
    return numbers.sort((a, b) => a - b)
  }

  // Função para gerar jogos com estatísticas
  const generateGames = async () => {
    setIsGenerating(true)
    const games = []
    const maxAttempts = 1000
    
    for (let gameCount = 0; gameCount < 5; gameCount++) {
      let validGame = false
      let attempts = 0
      
      while (!validGame && attempts < maxAttempts) {
        attempts++
        const game = generateGame()
        
        // Verificar critérios estatísticos
        const { even, odd } = countEvenOdd(game)
        const fibCount = countFibonacci(game)
        const borderCount = countBorderNumbers(game)
        const hasLongSeq = hasLongSequence(game)
        
        // Aplicar critérios baseados nas estatísticas observadas
        if ((even >= 6 && even <= 9) && 
            (odd >= 6 && odd <= 9) && 
            (fibCount >= 3 && fibCount <= 7) && 
            (borderCount >= 8 && borderCount <= 12) && 
            !hasLongSeq) {
          
          games.push({
            id: gameCount + 1,
            numbers: game,
            statistics: {
              even,
              odd,
              fibonacci: fibCount,
              border: borderCount,
              sum: game.reduce((a, b) => a + b, 0)
            }
          })
          validGame = true
        }
      }
      
      if (!validGame) {
        // Se não conseguir gerar com critérios, gerar um jogo simples
        const game = generateGame()
        const { even, odd } = countEvenOdd(game)
        games.push({
          id: gameCount + 1,
          numbers: game,
          statistics: {
            even,
            odd,
            fibonacci: countFibonacci(game),
            border: countBorderNumbers(game),
            sum: game.reduce((a, b) => a + b, 0)
          }
        })
      }
    }
    
    setGeneratedGames(games)
    
    // Calcular estatísticas gerais
    const totalEven = games.reduce((sum, game) => sum + game.statistics.even, 0)
    const totalOdd = games.reduce((sum, game) => sum + game.statistics.odd, 0)
    const totalFib = games.reduce((sum, game) => sum + game.statistics.fibonacci, 0)
    const totalBorder = games.reduce((sum, game) => sum + game.statistics.border, 0)
    
    setStatistics({
      avgEven: (totalEven / games.length).toFixed(1),
      avgOdd: (totalOdd / games.length).toFixed(1),
      avgFibonacci: (totalFib / games.length).toFixed(1),
      avgBorder: (totalBorder / games.length).toFixed(1)
    })
    
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🍀 Gerador Inteligente de Jogos da Lotofácil
          </h1>
          <p className="text-gray-600 text-lg">
            Baseado em estatísticas avançadas: Fibonacci, Moldura, Paridade e Sequências
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Configurações do Jogo
            </CardTitle>
            <CardDescription>
              Configure quantas dezenas deseja jogar (15 a 20)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="dozens">Número de Dezenas</Label>
                <Input
                  id="dozens"
                  type="number"
                  min="15"
                  max="20"
                  value={numDozens}
                  onChange={(e) => setNumDozens(parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={generateGames} 
                disabled={isGenerating}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Gerar Jogos
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Summary */}
        {statistics && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Estatísticas dos Jogos Gerados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{statistics.avgEven}</div>
                  <div className="text-sm text-gray-600">Média Pares</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{statistics.avgOdd}</div>
                  <div className="text-sm text-gray-600">Média Ímpares</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{statistics.avgFibonacci}</div>
                  <div className="text-sm text-gray-600">Média Fibonacci</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{statistics.avgBorder}</div>
                  <div className="text-sm text-gray-600">Média Moldura</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Games */}
        {generatedGames.length > 0 && (
          <div className="grid gap-6">
            <h2 className="text-2xl font-bold text-gray-800">Jogos Gerados</h2>
            {generatedGames.map((game) => (
              <Card key={game.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <CardTitle>Jogo #{game.id}</CardTitle>
                  <CardDescription className="text-green-100">
                    {numDozens} dezenas • Soma: {game.statistics.sum}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Numbers Grid */}
                  <div className="grid grid-cols-5 gap-3 mb-6">
                    {game.numbers.map((number) => (
                      <div
                        key={number}
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                          ${number % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'}
                          ${isFibonacci(number) ? 'ring-4 ring-orange-300' : ''}
                          ${[1,2,3,4,5,6,10,11,15,16,20,21,22,23,24,25].includes(number) ? 'border-4 border-green-400' : ''}
                        `}
                      >
                        {number}
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {game.statistics.even} Pares
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {game.statistics.odd} Ímpares
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        {game.statistics.fibonacci} Fibonacci
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {game.statistics.border} Moldura
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Como Funciona</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <strong>Números Pares/Ímpares:</strong> Baseado nas estatísticas dos últimos concursos, 
                  o gerador prioriza combinações com 6-9 números pares e 6-9 ímpares.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <strong>Sequência Fibonacci:</strong> Inclui números da sequência de Fibonacci 
                  (1, 1, 2, 3, 5, 8, 13, 21) que aparecem com frequência nos sorteios.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <strong>Moldura:</strong> Considera números das bordas do volante 
                  (1-6, 10-11, 15-16, 20-25) que têm padrões específicos.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <strong>Sequências:</strong> Evita sequências muito longas de números consecutivos 
                  que raramente aparecem nos sorteios.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

