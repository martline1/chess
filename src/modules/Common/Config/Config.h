#pragma once

#include <memory>
#include <cmath>

using std::unique_ptr;

class Config {
    private:
        int side;
        int outerPadding;
        int innerPadding;

        int gameSize;
        int squareSize;

    public:
        Config(int, int, int);

        int getSide();
        int getGameSize();
        int getSquareSize();
        int getOuterPadding();
        int getInnerPadding();
};
