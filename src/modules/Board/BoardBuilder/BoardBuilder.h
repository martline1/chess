#pragma once

#include <SDL.h>
#include <memory>

#include "DrawRectParams/DrawRectParams.h"

using std::unique_ptr;
using std::make_unique;

struct BoardBuilderParams;
struct Color;

class BoardBuilder {
    private:
        int rows;
        int columns;

    public:
        class BoardBuilderImpl;
        unique_ptr<BoardBuilderImpl> boardBuilderImpl;

        BoardBuilder();
        BoardBuilder(BoardBuilderParams*);

        void setRows(int);
        void setColumns(int);

        void render();
        int getRows();
        int getColumns();
        void drawRect(DrawRectParams*);

        static void copy(BoardBuilder*, unique_ptr<BoardBuilder>&);
};
