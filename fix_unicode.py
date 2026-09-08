import os, glob, re

def fix_unicode(match):
    code = match.group(1)
    if code:
        return chr(int(code, 16))
    return match.group(0)

def fix_unicode_4(match):
    return chr(int(match.group(1), 16))

for root, _, files in os.walk(r'D:\sih-legal-metrology\frontend'):
    if 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace \u{HEX} 
            new_content = re.sub(r'\\u\{([A-Fa-f0-9]+)\}', fix_unicode, content)
            
            # Replace \uXXXX
            new_content = re.sub(r'\\u([A-Fa-f0-9]{4})', fix_unicode_4, new_content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Fixed {file}')
