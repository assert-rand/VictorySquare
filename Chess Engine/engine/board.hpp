#ifndef BOARD
#define BOARD

enum pieces
{
    p,
    b,
    kn,
    r,
    q,
    k,
    P,
    B,
    KN,
    R,
    Q,
    K,
    e
};

class Board
{
private:
    pieces board[64] = {
        r, kn, b, q, k, b, kn, r,
        e, e, e, e, e, e, e, e,
        e, e, e, e, e, e, e, e,
        e, e, e, e, e, e, e, e,
        e, e, e, e, e, e, e, e,
        e, e, e, e, e, e, e, e,
        e, e, e, e, e, e, e, e,
        R, KN, B, Q, K, B, KN, R};

public:
    bool move(int i, int j, int i_, int j_);
    pieces get_piece(int i, int j);
    bool black_piece(pieces p);
    bool white_piece(pieces p);
};

#endif