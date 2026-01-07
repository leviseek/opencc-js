// 与 OpenCC 官方配置同步 (基于 config/*.json conversion_chain 顺序)
export const variants2standard = {
  cn: ['STPhrases', 'STCharacters'], // s2t.json
  hk: ['HKVariantsRevPhrases', 'HKVariantsRev'], // hk2s.json 第一阶段
  tw: ['TWVariantsRevPhrases', 'TWVariantsRev'], // tw2s.json 第一阶段
  twp: ['TWPhrasesRev', 'TWVariantsRevPhrases', 'TWVariantsRev'], // tw2sp.json 第一阶段
  jp: ['JPShinjitaiPhrases', 'JPShinjitaiCharacters', 'JPVariantsRev'], // jp2t.json
};

export const standard2variants = {
  cn: ['TSPhrases', 'TSCharacters'], // t2s.json
  hk: ['HKVariants'], // s2hk.json 第二阶段
  tw: ['TWVariants'], // s2tw.json 第二阶段
  twp: ['TWPhrases', 'TWVariants'], // s2twp.json 第二、三阶段
  jp: ['JPVariants'], // t2jp.json
};

export const presets = [
  {
    filename: 'full',
    from: Object.keys(variants2standard),
    to: Object.keys(standard2variants)
  },
  {
    filename: 'cn2t',
    from: ['cn'],
    to: ['hk', 'tw', 'twp', 'jp']
  },
  {
    filename: 't2cn',
    from: ['hk', 'tw', 'twp', 'jp'],
    to: ['cn']
  }
];
