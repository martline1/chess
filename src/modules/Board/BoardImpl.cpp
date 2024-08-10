#pragma once

#include "Board.h"

#include "BoardBuilder/BoardBuilder.h"
#include "BoardBuilder/DrawRectParams/DrawRectParams.h"

class Board::BoardImpl {
    private:
        App* father;
        Config* config;
        unique_ptr<BoardBuilder> boardBuilder;

    public:
        BoardImpl():
            boardBuilder(make_unique<BoardBuilder>())
        {}

        App* getFather() {
            return this->father;
        }

        unique_ptr<BoardBuilder>& getBoardBuilder() {
            return this->boardBuilder;
        }

        Config* getConfig() {
            return this->config;
        }

        void setConfig(Config* config) {
            this->config = config;
        }

        void setFather(App* father) {
            this->father = father;
        }

        ~BoardImpl() {}
};

Board::Board():
    boardImpl(make_unique<BoardImpl>())
{}

void Board::init() {
    Config* config = this->boardImpl->getConfig();

    int squareSize = config->getSquareSize();

    BoardBuilderParams boardBuilderParams = BoardBuilderParams();

    boardBuilderParams.rows    = 8;
    boardBuilderParams.columns = 8;
    boardBuilderParams.config  = config;

    BoardBuilder boardBuilder = BoardBuilder(&boardBuilderParams);
    boardBuilder.boardBuilderImpl->setFather(this);
    boardBuilder.boardBuilderImpl->setApp(this->boardImpl->getFather());

    BoardBuilder::copy(&boardBuilder, this->boardImpl->getBoardBuilder());
}

void Board::render() {
    App* app = this->boardImpl->getFather();
    Config* config = this->boardImpl->getConfig();
    unique_ptr<BoardBuilder>& boardBuilder = this->boardImpl->getBoardBuilder();

    // Draw background (outer layer)
    DrawRectParams background = DrawRectParams();

    background.r      = 207;
    background.g      = 167;
    background.b      = 110;
    background.a      = 255;
    background.x      = 0;
    background.y      = 0;
    background.width  = app->getScreenWidth();
    background.height = app->getScreenHeight();

    boardBuilder->drawRect(&background);

    // Draw inner board
    DrawRectParams inner = DrawRectParams();

    inner.r      = 101;
    inner.g      = 59;
    inner.b      = 24;
    inner.a      = 255;
    inner.x      = config->getOuterPadding();
    inner.y      = config->getOuterPadding();
    inner.width  = app->getScreenWidth() - (config->getOuterPadding() * 2);
    inner.height = app->getScreenHeight() - (config->getOuterPadding() * 2);

    boardBuilder->drawRect(&inner);

    boardBuilder->render();
}

void Board::copy(Board* source, unique_ptr<Board>& target) {
    BoardBuilder::copy(
        source->boardImpl->getBoardBuilder().get(),
        target->boardImpl->getBoardBuilder()
    );

    target->boardImpl->setConfig(source->boardImpl->getConfig());
    target->boardImpl->setFather(source->boardImpl->getFather());
}
