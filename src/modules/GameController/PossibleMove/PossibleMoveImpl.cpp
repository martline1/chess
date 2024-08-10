#pragma once

#include "PossibleMove.h"

#include "../../Pieces/Piece.h"
#include "../../Common/Config/Config.h"
#include "../../Pieces/Utils/Position/Position.h"
#include "../../Board/BoardBuilder/BoardBuilder.h"
#include "../../Pieces/Utils/RawPosition/RawPosition.h"

class PossibleMove::PossibleMoveImpl {
    private:
        App* app;
        Config* config;
        RawPosition rawPosition;
        BoardBuilder* boardBuilder;
        Piece<RawPosition>* selectedPiece;
    
    public:
        PossibleMoveImpl(PossibleMoveParams* params):
            app(params->app),
            config(params->config),
            boardBuilder(params->boardBuilder),
            selectedPiece(params->selectedPiece),
            rawPosition(RawPosition(params->rawPosition->getColumn(), params->rawPosition->getRow()))
        {}

        Position getParsedPosition() {
            RawPosition* rawPosition = &this->rawPosition;
            Piece<RawPosition>* selectedPiece = this->selectedPiece;

            return selectedPiece->pieceImpl->getParsedPosition(rawPosition);
        }

        Piece<RawPosition>* getSelectedPiece() {
            return this->selectedPiece;
        }

        Config* getConfig() {
            return this->config;
        }

        BoardBuilder* getBoardBuilder() {
            return this->boardBuilder;
        }

        RawPosition* getRawPosition() {
            return &this->rawPosition;
        }

        App* getApp() {
            return this->app;
        }
};

PossibleMove::PossibleMove(PossibleMoveParams* params):
    possibleMoveImpl(make_unique<PossibleMoveImpl>(params))
{}

void PossibleMove::render() {
    Config* config = this->possibleMoveImpl->getConfig();
    BoardBuilder* boardBuilder = this->possibleMoveImpl->getBoardBuilder();
    Position position = this->possibleMoveImpl->getParsedPosition();

    DrawRectParams params = DrawRectParams();

    params.r = 170;
    params.g = 255;
    params.b = 170;
    params.a = 127;

    params.x      = position.getX();
    params.y      = position.getY();
    params.width  = config->getSquareSize();
    params.height = config->getSquareSize();

    boardBuilder->drawRect(&params);
}

void PossibleMove::onPointerDown(int x, int y) {
    // Only react if it's being hovered (clicking the possible move)
    if (!this->isBeingHovered(x, y)) return;

    RawPosition* rawPosition = this->possibleMoveImpl->getRawPosition();

    this->possibleMoveImpl->getSelectedPiece()->onMoveEnd(
        rawPosition->getColumn(),
        rawPosition->getRow()
    );
}

bool PossibleMove::isBeingHovered(int x, int y) {
    Config* config = this->possibleMoveImpl->getConfig();
    Position position = this->possibleMoveImpl->getParsedPosition();

    SDL_Rect thisPiece = SDL_Rect();

    thisPiece.x = position.getX();
    thisPiece.y = position.getY();
    thisPiece.w = config->getSquareSize();
    thisPiece.h = config->getSquareSize();

    CollisionParams params = CollisionParams();

    params.config = this->possibleMoveImpl->getConfig();
    params.app    = this->possibleMoveImpl->getApp();

    Collision collision = Collision(&params);

    return collision.doesItContains(&thisPiece, x, y);
}
