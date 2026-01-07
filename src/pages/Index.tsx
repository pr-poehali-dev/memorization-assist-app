import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

type ReadingMode = 'full' | 'paragraph' | 'line';

const Index = () => {
  const [text, setText] = useState('');
  const [uploadedText, setUploadedText] = useState('');
  const [readingMode, setReadingMode] = useState<ReadingMode>('full');
  const [speed, setSpeed] = useState([1]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const handleUpload = () => {
    if (text.trim()) {
      setUploadedText(text);
      setCurrentIndex(0);
      setScore(0);
      setAttempts(0);
    }
  };

  const getTextSegments = () => {
    if (!uploadedText) return [];
    
    if (readingMode === 'line') {
      return uploadedText.split('\n').filter(line => line.trim());
    } else if (readingMode === 'paragraph') {
      return uploadedText.split('\n\n').filter(para => para.trim());
    }
    return [uploadedText];
  };

  const segments = getTextSegments();
  const currentSegment = segments[currentIndex] || '';
  const progress = segments.length > 0 ? ((currentIndex + 1) / segments.length) * 100 : 0;

  const handleNext = () => {
    if (currentIndex < segments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlePractice = () => {
    setAttempts(attempts + 1);
    const success = Math.random() > 0.3;
    if (success) {
      setScore(score + 1);
    }
  };

  const successRate = attempts > 0 ? Math.round((score / attempts) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight">MemoSpeak</h1>
          <p className="text-muted-foreground">Запоминай тексты через практику</p>
        </div>

        {!uploadedText ? (
          <Card className="animate-scale-in border-2">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon name="FileText" size={16} />
                  Вставь текст для изучения
                </label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Введи текст монолога, стихотворения или речи..."
                  className="min-h-[200px] resize-none text-base"
                />
              </div>
              <Button 
                onClick={handleUpload} 
                className="w-full h-12 text-base"
                disabled={!text.trim()}
              >
                <Icon name="Upload" size={20} className="mr-2" />
                Загрузить текст
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-2">
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Icon name="BookOpen" size={20} />
                    Режим чтения
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setUploadedText('');
                      setText('');
                    }}
                  >
                    <Icon name="X" size={16} className="mr-1" />
                    Новый текст
                  </Button>
                </div>

                <Tabs value={readingMode} onValueChange={(v) => {
                  setReadingMode(v as ReadingMode);
                  setCurrentIndex(0);
                }}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="line" className="gap-1">
                      <Icon name="Minus" size={14} />
                      Строки
                    </TabsTrigger>
                    <TabsTrigger value="paragraph" className="gap-1">
                      <Icon name="AlignLeft" size={14} />
                      Параграфы
                    </TabsTrigger>
                    <TabsTrigger value="full" className="gap-1">
                      <Icon name="FileText" size={14} />
                      Полный
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Icon name="Gauge" size={14} />
                      Скорость: {speed[0]}x
                    </span>
                    <Badge variant="secondary">
                      {currentIndex + 1} / {segments.length}
                    </Badge>
                  </div>
                  <Slider
                    value={speed}
                    onValueChange={setSpeed}
                    min={0.5}
                    max={2}
                    step={0.25}
                    className="w-full"
                  />
                </div>

                <Card className="bg-muted/50 border-0">
                  <CardContent className="pt-6">
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                      {currentSegment}
                    </p>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="flex-1"
                  >
                    <Icon name="ChevronLeft" size={18} />
                  </Button>
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-[2]"
                  >
                    <Icon name={isPlaying ? "Pause" : "Play"} size={18} className="mr-2" />
                    {isPlaying ? 'Пауза' : 'Читать'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={currentIndex === segments.length - 1}
                    className="flex-1"
                  >
                    <Icon name="ChevronRight" size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Icon name="Mic" size={20} />
                  Практика произношения
                </h2>

                <Button 
                  onClick={handlePractice}
                  className="w-full h-14 text-base"
                  variant="default"
                >
                  <Icon name="CircleDot" size={20} className="mr-2" />
                  Начать запись
                </Button>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Прогресс</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {attempts > 0 && (
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-primary">{score}</div>
                      <div className="text-xs text-muted-foreground">Правильно</div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold">{attempts}</div>
                      <div className="text-xs text-muted-foreground">Попыток</div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-green-600">{successRate}%</div>
                      <div className="text-xs text-muted-foreground">Точность</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
