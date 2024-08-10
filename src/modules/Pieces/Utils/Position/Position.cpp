#pragma once

#include "Position.h"

Position::Position():
    x(0),
    y(0)
{}

Position::Position(int value):
    x(value),
    y(value)
{}

Position::Position(int x, int y):
    x(x),
    y(y)
{}

int Position::getX() {
    return this->x;
}

int Position::getY() {
    return this->y;
}

void Position::setX(int x) {
    this->x = x;
}

void Position::setY(int y) {
    this->y = y;
}

