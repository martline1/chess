#pragma once

#include "Config.h"

Config::Config(int side, int outerPadding, int innerPadding):
    side(side),
    outerPadding(outerPadding),
    innerPadding(innerPadding)
{
    this->gameSize = side
        - (outerPadding * 2)
        - (innerPadding * 2);

    this->squareSize = std::floor(this->gameSize / 8);
}

int Config::getSide() {
    return this->side;
}

int Config::getGameSize() {
    return this->gameSize;
}

int Config::getSquareSize() {
    return this->squareSize;
}

int Config::getOuterPadding() {
    return this->outerPadding;
}

int Config::getInnerPadding() {
    return this->innerPadding;
}
