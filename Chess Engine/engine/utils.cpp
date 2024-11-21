#include "utils.hpp"
#include "board.hpp"
#include <bits/stdc++.h>

using namespace std;

bool ValidMoves::isValid_pawn(Board board, int i, int j, int i_, int j_)
{
    pieces piece = board.get_piece(i, j);
    pieces target = board.get_piece(i_, j_);

    if (piece != p && piece != P)
    {
        return false;
    }

    int row_diff = i_ - i;
    int col_diff = j_ - j;

    if (piece == p)
    {
        // Standard move: one square forward
        if (row_diff == 1 && col_diff == 0 && target == e)
        {
            return true;
        }
        // Initial two-square move
        if (i == 1 && row_diff == 2 && col_diff == 0 && target == e && board.get_piece(i + 1, j) == e)
        {
            return true;
        }
        // Capture move
        if (row_diff == 1 && abs(col_diff) == 1 && board.white_piece(target))
        {
            return true;
        }
    }

    if (piece == P)
    {
        // Standard move: one square forward
        if (row_diff == -1 && col_diff == 0 && target == e)
        {
            return true;
        }
        // Initial two-square move
        if (i == 6 && row_diff == -2 && col_diff == 0 && target == e && board.get_piece(i - 1, j) == e)
        {
            return true;
        }
        // Capture move
        if (row_diff == -1 && abs(col_diff) == 1 && board.black_piece(target))
        {
            return true;
        }
    }

    return false;
}

bool ValidMoves::isValid_rook(Board board, int i, int j, int i_, int j_)
{

    pieces piece = board.get_piece(i, j);
    pieces target = board.get_piece(i_, j_);

    if (piece != r && piece != R)
    {
        return false;
    }

    if (i != i_ && j != j_)
    {
        return false;
    }

    if (i == i_)
    { // Horizontal move
        int step = (j_ > j) ? 1 : -1;
        for (int col = j + step; col != j_; col += step)
        {
            if (board.get_piece(i, col) != e)
            {
                return false;
            }
        }
    }
    else if (j == j_)
    { // Vertical move
        int step = (i_ > i) ? 1 : -1;
        for (int row = i + step; row != i_; row += step)
        {
            if (board.get_piece(row, j) != e)
            {
                return false;
            }
        }
    }

    // Check if the destination is either empty or contains an opponent's piece
    if (piece == r)
    { // Black rook
        if (target == e || board.white_piece(target))
        {
            return true;
        }
    }
    else if (piece == R)
    { // White rook
        if (target == e || board.black_piece(target))
        {
            return true;
        }
    }

    return false;
}

bool ValidMoves::isValid_bishop(Board board, int i, int j, int i_, int j_)
{
    pieces piece = board.get_piece(i, j);
    pieces target = board.get_piece(i_, j_);

    if (piece != b && piece != B)
    {
        return false;
    }

    if (abs(i_ - i) != abs(j_ - j))
    {
        return false;
    }

    // Determine movement direction and check for obstructions
    int row_step = (i_ > i) ? 1 : -1;
    int col_step = (j_ > j) ? 1 : -1;

    int row = i + row_step;
    int col = j + col_step;
    while (row != i_ && col != j_)
    {
        if (board.get_piece(row, col) != e)
        { // Obstruction in the path
            return false;
        }
        row += row_step;
        col += col_step;
    }

    if (piece == b)
    { // Black bishop
        if (target == e || board.white_piece(target))
        {
            return true;
        }
    }
    else if (piece == B)
    { // White bishop
        if (target == e || board.black_piece(target))
        {
            return true;
        }
    }
    return false;
}

bool ValidMoves::isValid_knight(Board board, int i, int j, int i_, int j_)
{
    pieces piece = board.get_piece(i, j);
    pieces target = board.get_piece(i_, j_);

    if (piece != kn && piece != KN)
    {
        return false;
    }

    int row_diff = abs(i_ - i);
    int col_diff = abs(j_ - j);

    // Check for the L-shape move
    if (!((row_diff == 2 && col_diff == 1) || (row_diff == 1 && col_diff == 2)))
    {
        return false;
    }

    if (piece == kn)
    { // Black knight
        if (target == e || board.white_piece(target))
        {
            return true;
        }
    }
    else if (piece == KN)
    { // White knight
        if (target == e || board.black_piece(target))
        {
            return true;
        }
    }
    return false;
}

bool ValidMoves::isValid_queen(Board board, int i, int j, int i_, int j_)
{
    pieces piece = board.get_piece(i, j);
    pieces target = board.get_piece(i_, j_);

    if (piece != q && piece != Q)
    {
        return false;
    }

    bool is_straight = (i == i_ || j == j_);
    bool is_diagonal = (abs(i_ - i) == abs(j_ - j));

    if (!is_straight && !is_diagonal)
    {
        return false;
    }

    if (is_straight)
    {
        // Rook-like movement
        if (i == i_)
        { // Horizontal move
            int step = (j_ > j) ? 1 : -1;
            for (int col = j + step; col != j_; col += step)
            {
                if (board.get_piece(i, col) != e)
                {
                    return false;
                }
            }
        }
        else
        { // Vertical move
            int step = (i_ > i) ? 1 : -1;
            for (int row = i + step; row != i_; row += step)
            {
                if (board.get_piece(row, j) != e)
                {
                    return false;
                }
            }
        }
    }
    else if (is_diagonal)
    {
        // Bishop-like movement
        int row_step = (i_ > i) ? 1 : -1;
        int col_step = (j_ > j) ? 1 : -1;

        int row = i + row_step;
        int col = j + col_step;
        while (row != i_ && col != j_)
        {
            if (board.get_piece(row, col) != e)
            {
                return false;
            }
            row += row_step;
            col += col_step;
        }
    }

    if (piece == q)
    { // Black queen
        if (target == e || board.white_piece(target))
        {
            return true;
        }
    }
    else if (piece == Q)
    { // White queen
        if (target == e || board.black_piece(target))
        {
            return true;
        }
    }

    return false;
}

bool ValidMoves::isValid_king(Board board, int i, int j, int i_, int j_)
{
    pieces piece = board.get_piece(i, j);
    pieces target = board.get_piece(i_, j_);

    if (piece != k && piece != K)
    {
        return false;
    }

    int row_diff = abs(i_ - i);
    int col_diff = abs(j_ - j);

    if (row_diff > 1 || col_diff > 1)
    {
        return false;
    }

    if (piece == k)
    { // Black king
        if (target == e || board.white_piece(target))
        {
            return true;
        }
    }
    else if (piece == K)
    { // White king
        if (target == e || board.black_piece(target))
        {
            return true;
        }
    }
    return false;
}
