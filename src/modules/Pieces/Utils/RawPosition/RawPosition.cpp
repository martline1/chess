#pragma once

#include "RawPosition.h"

RawPosition::RawPosition():
    row(0),
    column(0)
{}

RawPosition::RawPosition(int value):
    row(value),
    column(value)
{}

RawPosition::RawPosition(int column, int row):
    row(row),
    column(column)
{}

void RawPosition::setRow(int row) {
    this->row = row;
}

void RawPosition::setColumn(int column) {
    this->column = column;
}

int RawPosition::getRow() {
    return this->row;
}

int RawPosition::getColumn() {
    return this->column;
}
