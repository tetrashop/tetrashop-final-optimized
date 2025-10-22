# ♟️ Chess Engine - موتور شطرنج هوشمند

یک موتور شطرنج پیشرفته با قابلیت‌های مختلف

## 🚀 ویژگی‌ها

### موتورهای موجود:
- **موتور پایه** (`simple_chess_fixed.py`) - حرکت‌های قانونی
- **هوش مصنوعی ساده** (`chess_ai.py`) - بازی تصادفی
- **موتور پیشرفته** (`core/engine.py`) - الگوریتم Minimax

## 🛠 نصب و راه‌اندازی

```bash
pip install chess
python3 simple_chess_fixed.py
# تست موتور پایه
python3 simple_chess_fixed.py

# تست هوش مصطوعی
python3 chess_ai.py
# ایجاد requirements.txt
echo "chess>=1.11.2" > requirements.txt

# ایجاد gitignore
cat > .gitignore << 'EOF'
__pycache__/
*.pyc
.env
*.log
