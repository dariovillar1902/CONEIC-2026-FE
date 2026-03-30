
import re

def extract_strings_from_pdf(pdf_path, min_length=4):
    try:
        with open(pdf_path, 'rb') as f:
            content = f.read()
            
        # Regex to find printable ASCII strings
        # This is a very rough "strings" implementation
        string_pattern = re.compile(b'[ -~]{' + str(min_length).encode() + b',}')
        matches = string_pattern.findall(content)
        
        # Decode and print found strings
        found_strings = []
        for match in matches:
            try:
                s = match.decode('utf-8')
                found_strings.append(s)
            except:
                pass
                
        # Now search for specific patterns in the extracted strings
        hex_colors = []
        fonts = []
        
        for s in found_strings:
            # Hex color pattern
            if re.search(r'#[0-9A-Fa-f]{6}', s):
                hex_colors.append(s)
            
            # Font pattern (naive)
            if "font" in s.lower() or "family" in s.lower() or "tipografía" in s.lower():
                fonts.append(s)
                
        print("--- EXTRACTED HEX COLORS ---")
        for c in hex_colors[:50]:
            print(c)
            
        print("\n--- EXTRACTED FONT REFERENCES ---")
        for f in fonts[:50]:
            print(f)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_strings_from_pdf('public/assets/CoNEIC-LOGOS-MDS.ai')
