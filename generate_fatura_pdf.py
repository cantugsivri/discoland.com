import os
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor

# 1 mm = 72 / 25.4 points = 2.834645
mm = 2.834645

# Standard Turkish business card size: 90mm x 55mm
width = 90 * mm
height = 55 * mm

pdf_path = "c:/Users/CANTUĞ/Desktop/2026 PROJELER/DISCOLAND/SİTE ÇALIŞMASI/BUSEWORLD_Fatura_Karti.pdf"

c = canvas.Canvas(pdf_path, pagesize=(width, height))

# System Fonts registration for Turkish characters
font_path = r"C:\Windows\Fonts\arial.ttf"
font_bold_path = r"C:\Windows\Fonts\arialbd.ttf"

if os.path.exists(font_path) and os.path.exists(font_bold_path):
    pdfmetrics.registerFont(TTFont('Arial', font_path))
    pdfmetrics.registerFont(TTFont('Arial-Bold', font_bold_path))
    font_reg = 'Arial'
    font_bold = 'Arial-Bold'
else:
    # Fallback to standard Helvetica if Windows fonts aren't in default paths
    font_reg = 'Helvetica'
    font_bold = 'Helvetica-Bold'

# Draw White Background
c.setFillColor(HexColor('#ffffff'))
c.rect(0, 0, width, height, fill=True, stroke=False)

# Draw a thin clean divider line at the top
c.setFillColor(HexColor('#000000'))
c.rect(0, height - 3, width, 3, fill=True, stroke=False)

# Draw General Header
c.setFillColor(HexColor('#000000'))
c.setFont(font_bold, 9.5)
c.drawString(10 * mm, height - 10 * mm, "FATURA BİLGİLERİ")

# Helper function to wrap text
def draw_wrapped_text(c, text, x, y, max_width, line_height, font_name, font_size, color):
    c.setFont(font_name, font_size)
    c.setFillColor(color)
    words = text.split(' ')
    lines = []
    current_line = ""
    for word in words:
        test_line = current_line + " " + word if current_line else word
        if c.stringWidth(test_line, font_name, font_size) < max_width:
            current_line = test_line
        else:
            lines.append(current_line)
            current_line = word
    if current_line:
        lines.append(current_line)
    
    current_y = y
    for line in lines:
        c.drawString(x, current_y, line)
        current_y -= line_height
    return current_y

# Label drawing helper (gray for titles for contrast)
def draw_label(c, label, x, y):
    c.setFont(font_bold, 5.5)
    c.setFillColor(HexColor('#555555'))
    c.drawString(x, y, label)

# Margins
start_x = 10 * mm
max_w = width - 20 * mm

# 1. Ticari Ünvan
draw_label(c, "TİCARET ÜNVANI", start_x, height - 16 * mm)
next_y = draw_wrapped_text(
    c, 
    "BUSEWORLD PRODUCTION MÜZİK TİCARET LİMİTED ŞİRKETİ", 
    start_x, 
    height - 19.5 * mm, 
    max_w, 
    3.2 * mm, 
    font_bold, 
    8.0, 
    HexColor('#000000')
)

# 2. Vergi Dairesi & Vergi No (Grid)
grid_y = next_y - 2.5 * mm
draw_label(c, "VERGİ DAİRESİ", start_x, grid_y)
c.setFont(font_bold, 7.5)
c.setFillColor(HexColor('#000000'))
c.drawString(start_x, grid_y - 3.2 * mm, "BODRUM")

vn_x = width / 2 + 2 * mm
draw_label(c, "VERGİ NUMARASI", vn_x, grid_y)
c.setFont(font_bold, 7.5)
c.setFillColor(HexColor('#000000'))
c.drawString(vn_x, grid_y - 3.2 * mm, "1911438318")

# 3. İş Yeri Adresi
address_y = grid_y - 8.0 * mm
draw_label(c, "İŞ YERİ ADRESİ", start_x, address_y)
draw_wrapped_text(
    c, 
    "PEKSİMET MAH. 5561 SK. UĞUR İŞÇİ KOOPERATİFİ UĞUR SİTESİ NO: 6 /3 İÇ KAPI NO: 2 BODRUM/ MUĞLA", 
    start_x, 
    address_y - 3.2 * mm, 
    max_w, 
    2.8 * mm, 
    font_reg, 
    6.5, 
    HexColor('#222222')
)

# Save PDF
c.showPage()
c.save()

print("PDF successfully created at:", pdf_path)
