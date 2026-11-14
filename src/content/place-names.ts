export const STATE_NAMES: Record<string, { en: string; zh: string }> = {
  AL: { en: "Alabama", zh: "阿拉巴马州" },
  AK: { en: "Alaska", zh: "阿拉斯加州" },
  AZ: { en: "Arizona", zh: "亚利桑那州" },
  AR: { en: "Arkansas", zh: "阿肯色州" },
  CA: { en: "California", zh: "加利福尼亚州" },
  CO: { en: "Colorado", zh: "科罗拉多州" },
  CT: { en: "Connecticut", zh: "康涅狄格州" },
  DE: { en: "Delaware", zh: "特拉华州" },
  DC: { en: "District of Columbia", zh: "哥伦比亚特区" },
  FL: { en: "Florida", zh: "佛罗里达州" },
  GA: { en: "Georgia", zh: "佐治亚州" },
  HI: { en: "Hawaii", zh: "夏威夷州" },
  ID: { en: "Idaho", zh: "爱达荷州" },
  IL: { en: "Illinois", zh: "伊利诺伊州" },
  IN: { en: "Indiana", zh: "印第安纳州" },
  IA: { en: "Iowa", zh: "艾奥瓦州" },
  KS: { en: "Kansas", zh: "堪萨斯州" },
  KY: { en: "Kentucky", zh: "肯塔基州" },
  LA: { en: "Louisiana", zh: "路易斯安那州" },
  ME: { en: "Maine", zh: "缅因州" },
  MD: { en: "Maryland", zh: "马里兰州" },
  MA: { en: "Massachusetts", zh: "马萨诸塞州" },
  MI: { en: "Michigan", zh: "密歇根州" },
  MN: { en: "Minnesota", zh: "明尼苏达州" },
  MS: { en: "Mississippi", zh: "密西西比州" },
  MO: { en: "Missouri", zh: "密苏里州" },
  MT: { en: "Montana", zh: "蒙大拿州" },
  NE: { en: "Nebraska", zh: "内布拉斯加州" },
  NV: { en: "Nevada", zh: "内华达州" },
  NH: { en: "New Hampshire", zh: "新罕布什尔州" },
  NJ: { en: "New Jersey", zh: "新泽西州" },
  NM: { en: "New Mexico", zh: "新墨西哥州" },
  NY: { en: "New York", zh: "纽约州" },
  NC: { en: "North Carolina", zh: "北卡罗来纳州" },
  ND: { en: "North Dakota", zh: "北达科他州" },
  OH: { en: "Ohio", zh: "俄亥俄州" },
  OK: { en: "Oklahoma", zh: "俄克拉何马州" },
  OR: { en: "Oregon", zh: "俄勒冈州" },
  PA: { en: "Pennsylvania", zh: "宾夕法尼亚州" },
  RI: { en: "Rhode Island", zh: "罗得岛州" },
  SC: { en: "South Carolina", zh: "南卡罗来纳州" },
  SD: { en: "South Dakota", zh: "南达科他州" },
  TN: { en: "Tennessee", zh: "田纳西州" },
  TX: { en: "Texas", zh: "得克萨斯州" },
  UT: { en: "Utah", zh: "犹他州" },
  VT: { en: "Vermont", zh: "佛蒙特州" },
  VA: { en: "Virginia", zh: "弗吉尼亚州" },
  WA: { en: "Washington", zh: "华盛顿州" },
  WV: { en: "West Virginia", zh: "西弗吉尼亚州" },
  WI: { en: "Wisconsin", zh: "威斯康星州" },
  WY: { en: "Wyoming", zh: "怀俄明州" },
};

export const PROVINCE_NAMES: Record<string, { en: string; zh: string }> = {
  ON: { en: "Ontario", zh: "安大略省" },
  BC: { en: "British Columbia", zh: "不列颠哥伦比亚省" },
  QC: { en: "Quebec", zh: "魁北克省" },
  AB: { en: "Alberta", zh: "艾伯塔省" },
  MB: { en: "Manitoba", zh: "马尼托巴省" },
  SK: { en: "Saskatchewan", zh: "萨斯喀彻温省" },
  NB: { en: "New Brunswick", zh: "新不伦瑞克省" },
  NS: { en: "Nova Scotia", zh: "新斯科舍省" },
  PE: { en: "Prince Edward Island", zh: "爱德华王子岛省" },
  NL: { en: "Newfoundland and Labrador", zh: "纽芬兰与拉布拉多省" },
  YT: { en: "Yukon", zh: "育空地区" },
  NT: { en: "Northwest Territories", zh: "西北地区" },
  NU: { en: "Nunavut", zh: "努纳武特地区" },
};

export const SCHOOL_NOTES: Record<string, { en: string; zh: string }> = {
  "location unknown": { en: "Location unknown", zh: "位置未知" },
  "Online school; plotted at its Reno, NV home": { en: "Online school; plotted at its home base in Reno, NV", zh: "在线学校，标注于其所在地内华达州里诺" },
  "Online school; plotted at its Stanford, CA home": { en: "Online school; plotted at its home base in Stanford, CA", zh: "在线学校，标注于其所在地加州斯坦福" },
  "Boarding/day school that also runs an online program": { en: "Boarding and day school that also runs an online program", zh: "寄宿制兼走读学校，同时开设在线课程" },
};

export const COUNTRY_NAMES: Record<string, { en: string; zh: string }> = {
  USA: { en: "United States", zh: "美国" },
  Canada: { en: "Canada", zh: "加拿大" },
  China: { en: "China", zh: "中国" },
};

export const CITY_NAMES_ZH: Record<string, string> = {
  Shanghai: "上海",
  Toronto: "多伦多",
  Vancouver: "温哥华",
};

type Place = { city: string | null; region: string | null; country: string | null };

export function regionName(country: string | null, code: string | null, locale: "en" | "zh") {
  if (!code) return null;
  const table = country === "Canada" ? PROVINCE_NAMES : STATE_NAMES;
  return table[code]?.[locale] ?? code;
}

export function placeLabel(p: Place, locale: "en" | "zh") {
  if (!p.country) return SCHOOL_NOTES["location unknown"][locale];
  const city = p.city ? (locale === "zh" ? (CITY_NAMES_ZH[p.city] ?? p.city) : p.city) : null;
  if (p.country === "USA") return [city, p.region].filter(Boolean).join(", ");
  const parts = [city, regionName(p.country, p.region, locale), COUNTRY_NAMES[p.country]?.[locale] ?? p.country];
  return parts.filter(Boolean).join(locale === "zh" ? "，" : ", ");
}
