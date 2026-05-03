#!/bin/bash

# Renk kodlari
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Dizinleri belirle
BACKUP_DIR="$HOME/Desktop/Site Yedekleri"
SOURCE_DIR="$HOME/Desktop/BLACK PRINCESS& WHITE PRINCE"

# Eger yedek klasoru yoksa olustur
mkdir -p "$BACKUP_DIR"

# Tarih formatı belirle
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/WebSitesi_Yedek_$DATE.zip"

clear
echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}      Black Princess & White Prince Yedekleme Araci     ${NC}"
echo -e "${CYAN}======================================================${NC}"
echo ""
echo "Site dosyalari sıkıstırılarak yedekleniyor..."
echo "Lutfen islem bitene kadar bekleyin..."
echo ""

# Sıkıstırma islemi
cd "$HOME/Desktop" || exit
zip -r -q "$BACKUP_FILE" "BLACK PRINCESS& WHITE PRINCE" -x "BLACK PRINCESS& WHITE PRINCE/.git/*" "BLACK PRINCESS& WHITE PRINCE/.DS_Store" "BLACK PRINCESS& WHITE PRINCE/*.command"

echo -e "${GREEN}✅ BASARILI! Yedekleme tamamlandi.${NC}"
echo ""
echo "Yedek dosyanizin konumu:"
echo -e "${CYAN}$BACKUP_FILE${NC}"
echo ""
echo "Bu pencereyi kapatabilirsiniz."
