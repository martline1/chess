#pragma once

#include <SDL.h>
#include <cmath>
#include <memory>

using std::move;
using std::unique_ptr;
using std::make_unique;

class Board {
    public:
        class BoardImpl;
        unique_ptr<BoardImpl> boardImpl;

        Board();

        void init();

        void render();

        static void copy(Board*, unique_ptr<Board>&);
};
