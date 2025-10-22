class ChessGame {
    constructor() {
        this.board = [];
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.gameOver = false;
        this.pieces = {
            'white': {
                'king': '♔',
                'queen': '♕',
                'rook': '♖',
                'bishop': '♗',
                'knight': '♘',
                'pawn': '♙'
            },
            'black': {
                'king': '♚',
                'queen': '♛',
                'rook': '♜',
                'bishop': '♝',
                'knight': '♞',
                'pawn': '♟'
            }
        };
        this.init();
    }

    init() {
        this.createBoard();
        this.setupPieces();
        this.renderBoard();
        this.updateStatus();
    }

    createBoard() {
        const board = [];
        for (let row = 0; row < 8; row++) {
            board[row] = [];
            for (let col = 0; col < 8; col++) {
                board[row][col] = null;
            }
        }
        this.board = board;
    }

    setupPieces() {
        // سربازها
        for (let col = 0; col < 8; col++) {
            this.board[1][col] = { type: 'pawn', color: 'black' };
            this.board[6][col] = { type: 'pawn', color: 'white' };
        }

        // رخ‌ها
        this.board[0][0] = { type: 'rook', color: 'black' };
        this.board[0][7] = { type: 'rook', color: 'black' };
        this.board[7][0] = { type: 'rook', color: 'white' };
        this.board[7][7] = { type: 'rook', color: 'white' };

        // اسب‌ها
        this.board[0][1] = { type: 'knight', color: 'black' };
        this.board[0][6] = { type: 'knight', color: 'black' };
        this.board[7][1] = { type: 'knight', color: 'white' };
        this.board[7][6] = { type: 'knight', color: 'white' };

        // فیل‌ها
        this.board[0][2] = { type: 'bishop', color: 'black' };
        this.board[0][5] = { type: 'bishop', color: 'black' };
        this.board[7][2] = { type: 'bishop', color: 'white' };
        this.board[7][5] = { type: 'bishop', color: 'white' };

        // وزیرها
        this.board[0][3] = { type: 'queen', color: 'black' };
        this.board[7][3] = { type: 'queen', color: 'white' };

        // شاه‌ها
        this.board[0][4] = { type: 'king', color: 'black' };
        this.board[7][4] = { type: 'king', color: 'white' };
    }

    renderBoard() {
        const chessboard = document.getElementById('chessboard');
        chessboard.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.col = col;

                const piece = this.board[row][col];
                if (piece) {
                    square.textContent = this.pieces[piece.color][piece.type];
                    square.style.color = piece.color === 'white' ? '#fff' : '#000';
                    square.style.textShadow = piece.color === 'white' ? '0 0 3px #000' : '0 0 3px #fff';
                }

                square.addEventListener('click', () => this.handleSquareClick(row, col));
                chessboard.appendChild(square);
            }
        }
    }

    handleSquareClick(row, col) {
        if (this.gameOver) return;

        const piece = this.board[row][col];

        if (this.selectedPiece) {
            // اگر خانه‌ای انتخاب شده بود، سعی کن حرکت کنی
            if (this.isValidMove(this.selectedPiece.row, this.selectedPiece.col, row, col)) {
                this.movePiece(this.selectedPiece.row, this.selectedPiece.col, row, col);
                this.selectedPiece = null;
                this.clearHighlights();
                this.switchPlayer();
                this.checkGameOver();
            } else {
                // اگر حرکت معتبر نبود، انتخاب جدید کن
                this.selectedPiece = piece && piece.color === this.currentPlayer ? { row, col, ...piece } : null;
                this.clearHighlights();
                this.highlightPossibleMoves(row, col);
            }
        } else {
            // اگر هیچ خانه‌ای انتخاب نشده بود
            if (piece && piece.color === this.currentPlayer) {
                this.selectedPiece = { row, col, ...piece };
                this.highlightPossibleMoves(row, col);
            }
        }

        this.renderBoard();
        this.updateStatus();
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        // بررسی‌های پایه
        if (fromRow === toRow && fromCol === toCol) return false;
        
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;

        // حرکت ساده سرباز (برای دمو)
        if (piece.type === 'pawn') {
            const direction = piece.color === 'white' ? -1 : 1;
            if (fromCol === toCol && fromRow + direction === toRow && !this.board[toRow][toCol]) {
                return true;
            }
        }

        // حرکت ساده برای سایر مهره‌ها (برای دمو)
        return true;
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;

        // ارتقای سرباز (ساده)
        if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
            piece.type = 'queen';
        }
    }

    highlightPossibleMoves(row, col) {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            const squareRow = parseInt(square.dataset.row);
            const squareCol = parseInt(square.dataset.col);
            
            if (this.isValidMove(row, col, squareRow, squareCol)) {
                square.classList.add('possible-move');
            }
        });
    }

    clearHighlights() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.remove('selected', 'possible-move');
        });
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    }

    checkGameOver() {
        // بررسی ساده برای دمو - اگر شاه حذف شد
        let whiteKing = false;
        let blackKing = false;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === 'king') {
                    if (piece.color === 'white') whiteKing = true;
                    if (piece.color === 'black') blackKing = true;
                }
            }
        }

        if (!whiteKing) {
            this.endGame('سیاه');
        } else if (!blackKing) {
            this.endGame('سفید');
        }
    }

    endGame(winner) {
        this.gameOver = true;
        document.getElementById('message').textContent = `بازی تمام شد! برنده: ${winner}`;
    }

    updateStatus() {
        const status = document.getElementById('status');
        status.textContent = `نوبت: ${this.currentPlayer === 'white' ? 'سفید' : 'سیاه'}`;
        
        if (this.selectedPiece) {
            status.textContent += ` | انتخاب شده: ${this.selectedPiece.type}`;
        }
    }
}

// توابع全局
let game;

function initGame() {
    game = new ChessGame();
}

function resetGame() {
    game = new ChessGame();
    document.getElementById('message').textContent = '';
}

// راه‌اندازی بازی هنگام لود صفحه
document.addEventListener('DOMContentLoaded', initGame);
