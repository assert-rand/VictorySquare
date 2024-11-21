#include <gtest/gtest.h>
#include "../engine/board.hpp"
#include "../engine/utils.hpp"
using namespace std;

class ValidMovesTest : public testing::Test {
protected:
    ValidMoves vm;
    Board board;
    vector<pieces> b1;
    ValidMovesTest() {
        b1 = {
            r, e, e, e, k, b, e, r,
            e, e, e, e, e, e, e, e,
            e, e, e, e, e, e, e, e,
            e, e, p, e, e, e, e, e,
            e, e, e, P, e, p, e, e,
            e, e, e, KN, e, e, e, e,
            P, P, B, e, P, P, e, P,
            R, KN, e, Q, K, e, e, R
        };
        board.set_board(b1);
    }

    
};

TEST_F(ValidMovesTest, rook_test) {
    bool ret = vm.isValid_rook(board,0,0,2,5);
    EXPECT_FALSE(ret);
    ret = vm.isValid_rook(board,0,0,0,5);
    EXPECT_FALSE(ret);
    ret = vm.isValid_rook(board,0,0,0,4);
    EXPECT_FALSE(ret);
    ret = vm.isValid_rook(board,0,0,6,0);
    EXPECT_TRUE(ret);
    ret = vm.isValid_rook(board,0,0,7,0);
    EXPECT_FALSE(ret);
}

TEST_F(ValidMovesTest, bishop_test) {
    bool ret = vm.isValid_bishop(board,6,2,7,3);
    EXPECT_FALSE(ret);
    ret = vm.isValid_bishop(board,6,2,7,2);
    EXPECT_FALSE(ret);
    ret = vm.isValid_bishop(board,6,2,5,3);
    EXPECT_FALSE(ret);
    ret = vm.isValid_bishop(board,6,2,5,1);
    EXPECT_TRUE(ret);
    ret = vm.isValid_bishop(board,6,2,7,0);
    EXPECT_FALSE(ret);
}

TEST_F(ValidMovesTest, pawn_test) {
    bool ret = vm.isValid_pawn(board,4,5,3,5);
    EXPECT_FALSE(ret);
    ret = vm.isValid_pawn(board,4,5,5,6);
    EXPECT_FALSE(ret);
    ret = vm.isValid_pawn(board,4,5,5,4);
    EXPECT_FALSE(ret);
    ret = vm.isValid_pawn(board,4,5,5,5);
    EXPECT_TRUE(ret);
    ret = vm.isValid_pawn(board,4,5,5,7);
    EXPECT_FALSE(ret);
}