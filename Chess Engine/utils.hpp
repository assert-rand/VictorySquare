#ifndef UTILS
#define UTILS
#include "board.hpp"
class ValidMoves
{
public:
    bool isValid_pawn(Board board, int i, int j, int i_, int j_);
    bool isValid_rook(Board board, int i, int j, int i_, int j_);
    bool isValid_bishop(Board board, int i, int j, int i_, int j_);
    bool isValid_knight(Board board, int i, int j, int i_, int j_);
    bool isValid_queen(Board board, int i, int j, int i_, int j_);
    bool isValid_king(Board board, int i, int j, int i_, int j_);
};

#endif