#pragma once

#include "Piece.h"

#include "../Common/Kind/Kind.h"
#include "../Common/Config/Config.h"
#include "../Common/GameState/GameState.h"
#include "../Common/Collision/Collision.h"
#include "../Common/PieceColor/PieceColor.h"
#include "../Common/InstanceOf/InstanceOf.h"
#include "../GameController/GameController.h"
#include "../GameController/PossibleMove/PossibleMove.h"
#include "./Kinds/King/King.h"

#include "Utils/Position/Position.h"
#include "Utils/RawPosition/RawPosition.h"

struct PieceParams {
    int row;
    App* app;
    Kind kind;
    int column;
    Config* config;
    PieceColor color;
    GameController* gameController;
    function<void(int, int)> renderTexture;
};

template<class T>
class Piece<T>::PieceImpl {
    private:
        App* app;
        Piece* father;
        Config* config;
        PieceColor color;
        RawPosition rawPosition;
        GameController* gameController;

        bool isWorking = false;

    public:
        PieceImpl(PieceParams* params, Piece* father):
            father(father),
            app(params->app),
            color(params->color),
            config(params->config),
            gameController(params->gameController),
            rawPosition(RawPosition(params->column, params->row))
        {}

        bool getIsWorking() {
            return this->isWorking;
        }

        void setFather(Piece* father) {
            this->setFather(father);
        }

        void setConfig(Config* config) {
            this->config = config;
        }

        void setGameController(GameController* gameController) {
            this->gameController = gameController;
        }

        void setRawPosition(RawPosition* rawPosition) {
            this->rawPosition.setRow(rawPosition->getRow());
            this->rawPosition.setColumn(rawPosition->getColumn());
        }

        PieceColor getColor() {
            return this->color;
        }

        App* getApp() {
            return this->app;
        }

        Config* getConfig() {
            return this->config;
        }

        Piece* getFather() {
            return this->father;
        }

        GameController* getGameController() {
            return this->gameController;
        }

        RawPosition* getRawPosition() {
            return &this->rawPosition;
        }

        /**
         * Out of the possible moves, filter the ones that
         * are out of the board, empty squares and squares
         * with enemy pieces, eat!
         */
        vector<RawPosition> filterValidMoves(vector<RawPosition> moves) {
            unique_ptr<GameState>& gameState = this->gameController->gameControllerImpl->getGameState();

            vector<RawPosition> acceptedMoves = vector<RawPosition>();

            for (RawPosition& move: moves) {
                GetValidPieceResponse response = gameState->gameStateImpl->getValidPiece(
                    move.getColumn(),
                    move.getRow()
                );

                if (response.isOutOfScope) continue;

                if (response.piece == nullptr) {
                    acceptedMoves.push_back(move);

                    continue;
                }

                // Square with enemy piece, eat!
                if (response.piece->pieceImpl->getColor() != this->getColor()) {
                    acceptedMoves.push_back(move);
                }

                // Square with friendly piece that it's the king, castle!
                if (InstanceOf::check<King>(response.piece)) {
                    acceptedMoves.push_back(move);
                }
            }

            return acceptedMoves;
        }

        Position getParsedPosition() {
            return this->getParsedPosition(&this->rawPosition);
        }

        /** Parsed means that is the actual pixel position in the canvas */
        Position getParsedPosition(RawPosition* rawPosition) {
            Config* config = this->config;
            Position position = Position();

            position.setX(
                (rawPosition->getColumn() + 1) * config->getSquareSize()
                - config->getSquareSize()
                + config->getOuterPadding()
                + config->getInnerPadding()
            );

            position.setY(
                (rawPosition->getRow() + 1) * config->getSquareSize()
                - config->getSquareSize()
                + config->getOuterPadding()
                + config->getInnerPadding()
            );

            return position;
        }
};

template<class T>
Piece<T>::Piece(PieceParams* params):
    alpha(1),
    renderTexture(params->renderTexture),
    pieceImpl(make_unique<PieceImpl>(params, this))
{
    this->updatePosition();
}

template<class T>
void Piece<T>::render() {
    Position position = this->pieceImpl->getParsedPosition();

    this->renderTexture(position.getX(), position.getY());
}

template<class T>
void Piece<T>::onPointerDown(int x, int y) {
    // Only react if is being hovered (clicking this piece)
    if (!this->isBeingHovered(x, y)) return;

    this->pieceImpl->getGameController()->gameControllerImpl->onPieceSelected(this);
}

template<class T>
bool Piece<T>::isBeingHovered(int x, int y) {
    Config* config = this->pieceImpl->getConfig();
    Position position = this->pieceImpl->getParsedPosition();

    SDL_Rect thisPiece = SDL_Rect();

    thisPiece.x = position.getX();
    thisPiece.y = position.getY();
    thisPiece.w = config->getSquareSize();
    thisPiece.h = config->getSquareSize();

    CollisionParams params = CollisionParams();

    params.config = this->pieceImpl->getConfig();
    params.app    = this->pieceImpl->getApp();

    Collision collision = Collision(&params);

    // Check if the mouse is in the square area of the piece
    return collision.doesItContains(&thisPiece, x, y);
}

template<class T>
void Piece<T>::updatePosition() {
    return this->updatePosition(this->pieceImpl->getRawPosition());
}

/**
 * This uses raw position [0, 7] to update the game state
 * of the controller, set parsed position and capture
 * pieces if needed.
 */
template<>
void Piece<RawPosition>::updatePosition(RawPosition* rawPosition) {
    GameController* gameController = this->pieceImpl->getGameController();
    unique_ptr<GameState>& gameState = gameController->gameControllerImpl->getGameState();
    BoardVec* board = gameState->gameStateImpl->getBoard();

    RawPosition* previousPosition = this->pieceImpl->getRawPosition();

    // Remove previous position
    board->at(previousPosition->getRow()).at(previousPosition->getColumn()) = nullptr;

    // Update position
    this->pieceImpl->setRawPosition(rawPosition);

    // TODO: Handle capture!

    // Assign new position
    board->at(rawPosition->getRow()).at(rawPosition->getColumn()) = this;
}

/**
 * Called when the desired move has been clicked, when
 * the piece is moving, one single time each turn.
 */
template<class T>
void Piece<T>::onMoveEnd(int column, int row) {
    RawPosition rawPosition = RawPosition(column, row);

    this->updatePosition(&rawPosition);

    this->pieceImpl->getGameController()->onPieceMoved();
}
