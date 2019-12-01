export function professionText(value){
  const professions = {
    SNIPER: '狙击',
    CASTER: '术师',
    MEDIC: '医疗',
    TANK: '重装',
    PIONEER: '先锋',
    SUPPORT: '辅助',
    WARRIOR: '近卫',
    SPECIAL: '特种'
  };
  return professions[value]?professions[value]:value;
};

export function position(value) {
  const positions = {
    MELEE: '近战位',
    RANGED: '远程位',
  };
  return positions[value]?positions[value]:value;
};

export function displayText(value) {
  const displays = {
    logo_Laterano: '拉特兰',
    logo_Leithanien: '莱塔尼亚',
    logo_abyssal: '深海猎人',
    logo_blacksteel: '黑钢',
    logo_kazimierz: '卡西米尔',
    logo_kjerag: '谢拉格',
    logo_lungmen: '龙门',
    logo_penguin: '企鹅物流',
    logo_rhine: '莱茵生命',
    logo_rhodes: '罗德岛',
    logo_rim: '雷姆必拓',
    logo_siesta: '汐斯塔',
    logo_ursus: '乌萨斯',
    logo_victoria: '维多利亚'
  };
  return displays[value]?displays[value]:value;
};