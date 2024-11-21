#ifndef BOARD
#define BOARD
#include <bits/stdc++.h>
using namespace std;
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
    vector<pieces> board = {
        r, kn, b, q, k, b, kn, r,
        e, e, e, e, e, e, e, e,
        e, e, e, e, e, e, e, e,
        e, e, e, e, e, e, e, e,
        e, e, e, e, e, e, e, e,
        e, e, e, e, e, e, e, e,
        e, e, e, e, e, e, e, e,
        R, KN, B, Q, K, B, KN, R};
    map<pieces,string> mp = {
        {r,"r"},{kn,"kn"},{b,"b"},
        {q,"q"},{k,"k"},{e,"e"},
        {R,"R"},{KN,"KN"},{B,"B"},
        {Q,"Q"},{K,"K"} 
    };

public:
    bool move(int i, int j, int i_, int j_);
    pieces get_piece(int i, int j);
    bool black_piece(pieces p);
    bool white_piece(pieces p);
    void set_board(vector<pieces> newboard);
    void print_board();
};

#endif