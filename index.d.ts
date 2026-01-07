/**
 * OpenCC-JS Type Definitions
 * 本地子模块的类型定义文件
 */

export type Locale = 
  | 'cn'      // 大陆简体
  | 'tw'      // 台湾正体
  | 'twp'     // 台湾正体（with phrases）
  | 'hk'      // 香港繁体
  | 'jp'      // 日本新字体
  | 't';      // 传统繁体

export interface ConverterOptions {
  from: Locale;
  to: Locale;
}

export interface ConverterFunction {
  (text: string): string;
}

export function Converter(options: ConverterOptions): ConverterFunction;

export as namespace OpenCC;
