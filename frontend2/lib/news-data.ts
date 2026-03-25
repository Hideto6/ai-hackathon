export type Category = 'すべて' | '国際' | '政治' | '経済' | 'テクノロジー' | '社会'

export interface NewsArticle {
  id: string
  category: Exclude<Category, 'すべて'>
  headline: string
  timestamp: string
  cards: ArticleCard[]
}

export interface ArticleCard {
  label: string
  headline: string
  body: string
  highlightedTerms?: HighlightedTerm[]
}

export interface HighlightedTerm {
  term: string
  reading: string
  description: string
}

export const categories: Category[] = ['すべて', '国際', '政治', '経済', 'テクノロジー', '社会']

export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    category: '経済',
    headline: '📈 給料が5%上がったって！就活生には朗報かもヨ〜',
    timestamp: '2時間前',
    cards: [
      {
        label: '何が起きた？',
        headline: '給料が5%以上アップ！？📈✨',
        body: '今年の春闘で、大手企業を中心に給料が平均5%以上アップすることが決まりました。これは30年ぶりの高水準です。',
        highlightedTerms: [
          {
            term: '春闘',
            reading: 'しゅんとう',
            description: '毎年春に、働く人の代表（労働組合）と会社が給料や働き方について話し合うこと。'
          }
        ]
      },
      {
        label: 'なんで上がってるの？',
        headline: '物価が上がって生活が苦しくなってるから💸',
        body: '物価が上がり続けているため、給料が上がらないと実質的に生活が苦しくなります。そのため労働組合が強く賃上げを求めました。'
      },
      {
        label: 'これからどうなる？',
        headline: '中小企業にも広がるかが注目だネ👀',
        body: '大手企業の賃上げが中小企業にも波及するかどうかが今後の焦点です。政府も中小企業支援を強化する方針を示しています。'
      }
    ]
  },
  {
    id: '2',
    category: '国際',
    headline: '🌍 アメリカと中国がまた関税でもめてるみたいだヨ💦',
    timestamp: '4時間前',
    cards: [
      {
        label: '何が起きた？',
        headline: '米中の貿易摩擦が再燃！🔥',
        body: 'アメリカが中国製品に対する追加関税を発表し、中国も報復措置を示唆しています。両国の緊張が高まっています。',
        highlightedTerms: [
          {
            term: '関税',
            reading: 'かんぜい',
            description: '外国から輸入される商品にかけられる税金のこと。自国の産業を守るために使われることが多い。'
          }
        ]
      },
      {
        label: 'なんでもめてるの？',
        headline: '半導体とか技術覇権の争いなんだよネ🖥️',
        body: '両国は最先端技術、特に半導体分野での主導権を争っています。経済的な利益だけでなく、安全保障上の問題も絡んでいます。'
      },
      {
        label: '日本への影響は？',
        headline: '輸出企業には打撃かも…📉',
        body: '日本の輸出企業、特に自動車や電子部品メーカーにとって、米中対立の激化は供給網に影響を与える可能性があります。'
      }
    ]
  },
  {
    id: '3',
    category: 'テクノロジー',
    headline: '🤖 AIがついに人間の仕事を奪い始めた！？ビックリだネ😲',
    timestamp: '6時間前',
    cards: [
      {
        label: '何が起きた？',
        headline: '大手企業がAI導入で人員削減発表💼',
        body: '複数の大手企業が生成AI技術の導入により、事務職を中心に人員削減を行うと発表しました。',
        highlightedTerms: [
          {
            term: '生成AI',
            reading: 'せいせいエーアイ',
            description: '文章や画像などを自動で作り出すことができる人工知能技術のこと。ChatGPTなどが代表例。'
          }
        ]
      },
      {
        label: 'どんな仕事が影響受けるの？',
        headline: '事務作業や翻訳が特に危ないらしい📝',
        body: 'データ入力、書類作成、翻訳、カスタマーサポートなど、定型的な業務がAIに置き換わりやすいとされています。'
      },
      {
        label: '対策はあるの？',
        headline: 'リスキリングが大事になってくるヨ📚',
        body: '政府や企業はAI時代に対応するため、労働者の再教育（リスキリング）プログラムを拡充する方針です。'
      }
    ]
  },
  {
    id: '4',
    category: '政治',
    headline: '🗳️ 来月の選挙、若者の投票率が心配だネェ〜💭',
    timestamp: '8時間前',
    cards: [
      {
        label: '何が起きた？',
        headline: '統一地方選挙が来月実施されるヨ🏛️',
        body: '来月、全国で統一地方選挙が実施されます。地方議会議員や首長を選ぶ重要な選挙です。',
        highlightedTerms: [
          {
            term: '統一地方選挙',
            reading: 'とういつちほうせんきょ',
            description: '4年に一度、全国の地方自治体で同時に行われる選挙のこと。投票率向上のために統一して実施される。'
          }
        ]
      },
      {
        label: 'なんで若者の投票率が低いの？',
        headline: '政治が自分事に感じられないからかナ🤔',
        body: '若年層の投票率は依然として低い傾向にあります。政治への関心の低さや、投票の手間が原因とされています。'
      },
      {
        label: '解決策は？',
        headline: 'ネット投票の導入が議論されてるヨ📱',
        body: 'デジタル時代に対応したオンライン投票の導入や、投票所の増設など、様々な対策が検討されています。'
      }
    ]
  },
  {
    id: '5',
    category: '社会',
    headline: '🏠 一人暮らしの家賃がまた上がってるって話だヨ😢',
    timestamp: '12時間前',
    cards: [
      {
        label: '何が起きた？',
        headline: '都市部の家賃が過去最高水準に📊',
        body: '東京をはじめとする大都市圏で、賃貸住宅の家賃が過去最高水準を更新しています。特に単身者向け物件の値上がりが顕著です。'
      },
      {
        label: 'なんで上がってるの？',
        headline: '建築コストと需要増加が原因みたい🏗️',
        body: '建築資材の高騰と人手不足による建設コストの上昇に加え、都市部への人口集中が続いていることが主な要因です。'
      },
      {
        label: '対策はあるの？',
        headline: '住宅手当の拡充を求める声が増加中💬',
        body: '政府や自治体に対し、若年層向けの住宅手当拡充や、公営住宅の増設を求める声が高まっています。'
      }
    ]
  }
]
