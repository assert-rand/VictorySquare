#include "utils.hpp"
#include "board.hpp"
#include <bits/stdc++.h>

bool Board::move(int i, int j, int i_, int j_)
{
    return false;
}

pieces Board::get_piece(int i, int j)
{
    return board[i * 8 + j];
}

bool Board::black_piece(pieces target)
{
    if (target != e && target != P && target != B && target != KN && target != R && target != Q && target != K)
    {
        return true;
    }
    return false;
}

bool Board::white_piece(pieces target)
{
    if (target != e && target != p && target != b && target != kn && target != r && target != q && target != k)
    {
        return true;
    }
    return false;
}
