import zipfile
import xml.etree.ElementTree as ET
import os

docx_path = r"c:\Project\Personal\DocGiaTruyen\docs\Tài liệu Thiết kế Hệ thống Độc Giả Truyện (DocGiaTruyen).docx"
output_path = r"c:\Project\Personal\DocGiaTruyen\docs\docx_content.txt"

try:
    with zipfile.ZipFile(docx_path) as doc:
        content = doc.read('word/document.xml')
        root = ET.fromstring(content)
        
        # A simple way to get text with some spacing
        text = []
        for node in root.iter():
            if node.tag.endswith('t') and node.text:
                text.append(node.text)
            elif node.tag.endswith('p'):
                text.append('\n')
                
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(''.join(text))
except Exception as e:
    print(f"Error: {e}")
