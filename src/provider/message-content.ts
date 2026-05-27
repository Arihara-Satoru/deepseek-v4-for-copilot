import type { MimoContentPart } from '../types';

/**
 * 将 MiMo 消息内容转换为纯文本，供分类、日志和调试摘要使用。
 * 图片内容不会展开原始 base64，只保留稳定的占位文本。
 */
export function getMessageTextContent(content: string | readonly MimoContentPart[]): string {
	if (typeof content === 'string') {
		return content;
	}

	return content
		.map((part) => {
			if (part.type === 'text') {
				return part.text;
			}
			return '[Image Input]';
		})
		.join('\n');
}
