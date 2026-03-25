import type { NewsCategory, NewsEntity } from "@/entities/news/model/types";

export const homeCategories: Array<"すべて" | NewsCategory> = [
  "すべて",
  "国際",
  "政治",
  "経済",
  "テクノロジー",
  "社会",
];

export const homeDemoNewsItems: NewsEntity[] = [
  {
    id: "1",
    category: "経済",
    headline: "📈 給料が5%上がったって！就活生には朗報かもヨ〜",
    timestamp: "2時間前",
    notificationHook: "春闘で賃上げが進んでるらしいヨ。就活の空気、ちょい変わるかもネ。",
    isSaved: true,
    cards: [
      {
        label: "何が起きた？",
        headline: "給料が5%以上アップ！？📈✨",
        body: "今年の春闘で、大手企業を中心に給料が平均5%以上アップすることが決まりました。これは30年ぶりの高水準です。",
        highlightedTerms: [
          {
            id: "shunto",
            term: "春闘",
            reading: "しゅんとう",
            description: "毎年春に、労働組合と会社が給料や働き方を話し合うこと。",
          },
        ],
      },
      {
        label: "なんで上がってるの？",
        headline: "物価が上がって生活が苦しくなってるから💸",
        body: "物価が上がり続けているため、給料が上がらないと実質的に生活が苦しくなります。そのため労働組合が強く賃上げを求めました。",
      },
      {
        label: "自分への影響",
        headline: "初任給アップの流れが広がるかも👀",
        body: "大手企業の賃上げが中小企業にも波及すれば、就活生や若手の待遇改善につながる可能性があります。",
      },
    ],
  },
  {
    id: "2",
    category: "国際",
    headline: "🌍 アメリカと中国がまた関税でもめてるみたいだヨ💦",
    timestamp: "4時間前",
    notificationHook: "米中の関税バトル、また空気が悪くなってるヨ。物価にも関係しそうだネ。",
    cards: [
      {
        label: "何が起きた？",
        headline: "米中の貿易摩擦が再燃！🔥",
        body: "アメリカが中国製品に対する追加関税を発表し、中国も報復措置を示唆しています。両国の緊張が高まっています。",
        highlightedTerms: [
          {
            id: "tariff",
            term: "関税",
            reading: "かんぜい",
            description: "外国から入ってくる商品にかける税金。値段に影響しやすい。",
          },
        ],
      },
      {
        label: "なんでもめてるの？",
        headline: "半導体とか技術覇権の争いなんだよネ🖥️",
        body: "両国は最先端技術、特に半導体分野での主導権を争っています。経済だけでなく安全保障の問題も絡んでいます。",
      },
      {
        label: "自分への影響",
        headline: "スマホやガジェットの値段にも波及するかも📦",
        body: "供給網が不安定になると、電子機器や部品の価格上昇につながる可能性があります。",
      },
    ],
  },
  {
    id: "3",
    category: "テクノロジー",
    headline: "🤖 AIがついに人間の仕事を奪い始めた！？ビックリだネ😲",
    timestamp: "6時間前",
    notificationHook: "生成AIで仕事の中身が変わるって話、いよいよ現実味が出てきたヨ。",
    isSaved: true,
    cards: [
      {
        label: "何が起きた？",
        headline: "大手企業がAI導入で人員削減発表💼",
        body: "複数の大手企業が生成AI技術の導入により、事務職を中心に人員削減を行うと発表しました。",
        highlightedTerms: [
          {
            id: "gen-ai",
            term: "生成AI",
            reading: "せいせいエーアイ",
            description: "文章や画像などを自動で作る人工知能のこと。",
          },
        ],
      },
      {
        label: "どんな仕事が影響受けるの？",
        headline: "事務作業や翻訳が特に危ないらしい📝",
        body: "データ入力、書類作成、翻訳、カスタマーサポートなど、定型的な業務がAIに置き換わりやすいとされています。",
      },
      {
        label: "自分への影響",
        headline: "就活ではAIを使える前提が強くなりそう📚",
        body: "AIを活用しながら考える力や、AIでは置き換えにくい対人スキルの重要性が高まりそうです。",
      },
    ],
  },
  {
    id: "4",
    category: "政治",
    headline: "🗳️ 来月の選挙、若者の投票率が心配だネェ〜💭",
    timestamp: "8時間前",
    notificationHook: "選挙が近いのに若い人の投票率が低いらしいヨ。生活にも結構ひびく話だネ。",
    cards: [
      {
        label: "何が起きた？",
        headline: "統一地方選挙が来月実施されるヨ🏛️",
        body: "来月、全国で統一地方選挙が実施されます。地方議会議員や首長を選ぶ重要な選挙です。",
        highlightedTerms: [
          {
            id: "local-election",
            term: "統一地方選挙",
            reading: "とういつちほうせんきょ",
            description: "4年に一度、各地の知事や議員などをまとめて選ぶ選挙。",
          },
        ],
      },
      {
        label: "なんで若者の投票率が低いの？",
        headline: "政治が自分事に感じられないからかナ🤔",
        body: "若年層の投票率は依然として低い傾向にあります。政治への関心の低さや、投票の手間が原因とされています。",
      },
      {
        label: "自分への影響",
        headline: "学費支援や交通政策にもつながるヨ📱",
        body: "地方自治体の政策は、奨学金、子育て支援、公共交通など学生生活に近いテーマへ直接影響します。",
      },
    ],
  },
  {
    id: "5",
    category: "社会",
    headline: "🏠 一人暮らしの家賃がまた上がってるって話だヨ😢",
    timestamp: "12時間前",
    notificationHook: "都市部の家賃、また上がってるみたいだヨ。一人暮らし勢には地味に重いネ。",
    cards: [
      {
        label: "何が起きた？",
        headline: "都市部の家賃が過去最高水準に📊",
        body: "東京をはじめとする大都市圏で、賃貸住宅の家賃が過去最高水準を更新しています。特に単身者向け物件の値上がりが顕著です。",
      },
      {
        label: "なんで上がってるの？",
        headline: "建築コストと需要増加が原因みたい🏗️",
        body: "建築資材の高騰と人手不足による建設コストの上昇に加え、都市部への人口集中が続いていることが主な要因です。",
      },
      {
        label: "自分への影響",
        headline: "進学や就職で住む場所選びがさらに重要に🏠",
        body: "家賃の上昇で、学校や職場の近さだけでなく、エリアや初期費用の比較がより大事になります。",
      },
    ],
  },
];

export function findHomeNewsById(newsId: string) {
  return homeDemoNewsItems.find((article) => article.id === newsId) ?? null;
}
