#pragma once

#include "GameState.h"

#include <iostream>

#include "../PieceColor/PieceColor.h"
#include "../../Pieces/Piece.h"
#include "../../Pieces/Utils/RawPosition/RawPosition.h"
#include "../../GameController/PossibleMove/PossibleMove.h"

typedef vector<vector<Piece<RawPosition>*>> BoardVec;

struct GetValidPieceResponse {
    bool isOutOfScope;
    Piece<RawPosition>* piece;
};

class GameState::GameStateImpl {
    private:
        PieceColor turn;
        BoardVec board;

    public:
        GameStateImpl():
            turn(PieceColor::WHITE)
        {
            // Init the board with nullptr's
            for (int row = 0; row < 8; row++) {
                vector<Piece<RawPosition>*> pieces;

                for (int column = 0; column < 8; column++) {
                    pieces.push_back(nullptr);
                }

                this->board.push_back(pieces);
            }
        }

        BoardVec* getBoard() {
            return &this->board;
        }

        GetValidPieceResponse getValidPiece(int column, int row) {
            try {
                Piece<RawPosition>* piece = this->board.at(row).at(column);

                GetValidPieceResponse response = GetValidPieceResponse();

                response.isOutOfScope = false;
                response.piece = piece;

                return response;
            } catch (...) {
                GetValidPieceResponse response = GetValidPieceResponse();

                response.isOutOfScope = true;
                response.piece = nullptr;

                return response;
            }
        }
};

GameState::GameState():
    gameStateImpl(make_unique<GameStateImpl>())
{}
