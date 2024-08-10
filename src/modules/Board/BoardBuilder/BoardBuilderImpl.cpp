#pragma once

#include "BoardBuilder.h"

#include "../Board.h"
#include "../../App/App.h"
#include "../../Common/Config/Config.h"

struct BoardBuilderParams {
    int rows;
    int columns;
    Config* config;
};

struct Color {
    int r;
    int g;
    int b;
    int a;
};

class BoardBuilder::BoardBuilderImpl {
    private:
        App* app;
        Board* father;
        Config* config;
        Color whiteColor;
        Color blackColor;

    public:
        BoardBuilderImpl() {
            this->init();
        }

        BoardBuilderImpl(BoardBuilderParams* params):
            config(params->config)
        {
            this->init();
        }

        void init() {
            this->whiteColor = Color();

            this->whiteColor.r = 227;
            this->whiteColor.g = 199;
            this->whiteColor.b = 155;
            this->whiteColor.a = 255;

            this->blackColor = Color();

            this->blackColor.r = 101;
            this->blackColor.g = 59;
            this->blackColor.b = 24;
            this->blackColor.a = 255;
        }

        Color* getWhiteColor() {
            return &this->whiteColor;
        }

        Color* getBlackColor() {
            return &this->blackColor;
        }

        Config* getConfig() {
            return this->config;
        }

        Board* getFather() {
            return this->father;
        }

        App* getApp() {
            return this->app;
        }

        void setApp(App* app) {
            this->app = app;
        }

        void setConfig(Config* config) {
            this->config = config;
        }

        void setFather(Board* father) {
            this->father = father;
        }
};

BoardBuilder::BoardBuilder():
    boardBuilderImpl(make_unique<BoardBuilderImpl>())
{}

BoardBuilder::BoardBuilder(BoardBuilderParams* params):
    rows(params->rows),
    columns(params->columns),
    boardBuilderImpl(make_unique<BoardBuilderImpl>(params))
{}

void BoardBuilder::setRows(int rows) {
    this->rows = rows;
}

void BoardBuilder::setColumns(int columns) {
    this->columns = columns;
}

int BoardBuilder::getRows() {
    return this->rows;
}

int BoardBuilder::getColumns() {
    return this->columns;
}

void BoardBuilder::render() {
    Config* config = this->boardBuilderImpl->getConfig();

    for (int row = 0; row < this->getRows(); row++) {
        for (int column = 0; column < this->getColumns(); column++) {
            Color* color = ((row + column) % 2 == 0)
                ? this->boardBuilderImpl->getWhiteColor()
                : this->boardBuilderImpl->getBlackColor();

            int x = (column * config->getSquareSize()) + config->getInnerPadding() + config->getOuterPadding();
            int y = (row * config->getSquareSize()) + config->getInnerPadding() + config->getOuterPadding();

            DrawRectParams square = DrawRectParams();

            square.r      = color->r;
            square.g      = color->g;
            square.b      = color->b;
            square.a      = color->a;
            square.x      = x;
            square.y      = y;
            square.width  = config->getSquareSize();
            square.height = config->getSquareSize();

            this->drawRect(&square);
        }
    }
}

void BoardBuilder::drawRect(DrawRectParams* drawRectParams) {
    App* app = this->boardBuilderImpl->getApp();

    SDL_SetRenderDrawColor(
        app->getRenderer(),
        drawRectParams->r,
        drawRectParams->g,
        drawRectParams->b,
        drawRectParams->a
    );

    SDL_Rect rect;

    rect.x = drawRectParams->x;
    rect.y = drawRectParams->y;
    rect.w = drawRectParams->width;
    rect.h = drawRectParams->height;

    SDL_RenderFillRect(app->getRenderer(), &rect);
}

void BoardBuilder::copy(BoardBuilder* source, unique_ptr<BoardBuilder>& target) {
    target->boardBuilderImpl->setConfig(source->boardBuilderImpl->getConfig());
    target->boardBuilderImpl->setFather(source->boardBuilderImpl->getFather());
    target->boardBuilderImpl->setApp(source->boardBuilderImpl->getApp());

    target->setRows(source->getRows());
    target->setColumns(source->getColumns());
}
