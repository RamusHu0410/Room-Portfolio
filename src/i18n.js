import { useLanguageStore } from './languageStore';

const translations = {
  en: {
    'hud.title': 'Room Portfolio Universe',
    'hud.hint':
      'WASD / Arrow keys to move · Drag to look around · Scroll to zoom · Click the laptop to sit down and view the project',
    'settings.toggle': 'Settings',
    'settings.dragTitle': 'Mouse Drag Direction',
    'settings.invertX': 'Invert horizontal drag',
    'settings.invertY': 'Invert vertical drag',
    'settings.language': 'Language',
    'settings.langEnglish': 'English',
    'settings.langChinese': '中文',
    'exit.standUp': 'Stand Up',
    'tag.resume': 'Resume',
    'tag.awards': 'Awards',
    'modal.close': 'Close',
    'modal.about': 'About Me',
    'modal.experience': 'Extracurricular Activities',
    'modal.education': 'Education',
    'modal.skills': 'Skills',
    'modal.awards': 'Awards & Certificates',
    'modal.footer': 'References available upon request',
    'awards.title': 'Awards & Certificates',
    'awards.subtitle': 'Certificates & Honors',
    'project.tagline': 'A not-so-serious project on GitHub',
    'project.description':
      'This project is currently a joke — a cross-platform experiment built mainly in Python, with a bit of Dart and C++.',
    'screen.openInGithub': 'Open in GitHub ↗',
    'tag.piano': 'Piano Performance',
    'video.title': 'Piano Performance',
    'video.subtitle': 'A recording of one of my performances',
    'video.watchOnYoutube': 'Watch on YouTube ↗'
  },
  zh: {
    'hud.title': '房间作品集小宇宙',
    'hud.hint':
      'WASD / 方向键移动 · 拖动鼠标环顾四周 · 滚轮缩放 · 点击笔记本坐下查看项目',
    'settings.toggle': '设置',
    'settings.dragTitle': '鼠标拖动方向',
    'settings.invertX': '反转左右拖动',
    'settings.invertY': '反转上下拖动',
    'settings.language': '语言',
    'settings.langEnglish': 'English',
    'settings.langChinese': '中文',
    'exit.standUp': '起身离开',
    'tag.resume': '简历',
    'tag.awards': '荣誉证书',
    'modal.close': '关闭',
    'modal.about': '关于我',
    'modal.experience': '课外活动',
    'modal.education': '教育经历',
    'modal.skills': '技能',
    'modal.awards': '荣誉与证书',
    'modal.footer': '推荐信可另行提供',
    'awards.title': '荣誉与证书',
    'awards.subtitle': '证书与荣誉',
    'project.tagline': 'GitHub 上一个不太正经的项目',
    'project.description':
      '这个项目目前只是个玩笑——主要用 Python,搭配 Dart 和 C++ 做的跨端小实验。',
    'screen.openInGithub': '在 GitHub 中打开 ↗',
    'tag.piano': '钢琴演奏',
    'video.title': '钢琴演奏',
    'video.subtitle': '我的一段演奏录像',
    'video.watchOnYoutube': '在 YouTube 中观看 ↗'
  }
};

export function useT() {
  const lang = useLanguageStore((s) => s.lang);
  return (key) => translations[lang]?.[key] ?? translations.en[key] ?? key;
}
