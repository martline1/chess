#pragma once

#include <stdlib.h>
#include "../Pieces/Kinds/Bishop/Bishop.h"
#include "../Pieces/Kinds/Knight/Knight.h"
#include "../Pieces/Kinds/Rook/Rook.h"
#include "../Pieces/Kinds/Queen/Queen.h"
#include "../Pieces/Kinds/King/King.h"

#include "GameController.h"

#include "../App/App.h"
#include "../Pieces/Piece.h"
#include "../Pieces/Kinds/Pawn/Pawn.h"
#include "../PiecesLoader/PiecesLoader.h"
#include "../Common/GameState/GameState.h"
#include "../Common/InstanceOf/InstanceOf.h"
#include "../Common/PiecesDict/PiecesDict.h"
#include "../Board/BoardBuilder/BoardBuilder.h"
#include "PossibleMove/PossibleMove.h"
#include "PossibleMove/PossibleMoveParams/PossibleMoveParams.h"

typedef map<Kind, function<void(int, int)>> PiecesInnerDict;
typedef map<PieceColor, PiecesInnerDict> PiecesDict;

struct GameControllerParams {
    Config* config;
};

class GameController::GameControllerImpl {
    private:
        App* app;
        Config* config;
        Pawn* pawnToIgnore;
        PiecesDict* pieces;
        BoardBuilder* boardBuilder;
        PiecesLoader* piecesLoader;
        unique_ptr<GameState> gameState;
        Piece<RawPosition>* selectedPiece;

        vector<PossibleMove*> possibleMoves;
        vector<Piece<RawPosition>*>* piecePtrs;

    public:
        GameControllerImpl(GameControllerParams* params):
            piecePtrs(nullptr),
            piecesLoader(nullptr),
            pawnToIgnore(nullptr),
            selectedPiece(nullptr),
            config(params->config),
            gameState(make_unique<GameState>())
        {}

        void setApp(App* app) {
            this->app = app;
        }

        void setBoardBuilder(BoardBuilder* boardBuilder) {
            this->boardBuilder = boardBuilder;
        }

        void setPiecePtrs(vector<Piece<RawPosition>*>* piecePtrs) {
            this->piecePtrs = piecePtrs;
        }

        void setSelectedPiece(Piece<RawPosition>* selectedPiece) {
            this->selectedPiece = selectedPiece;
        }

        void setPawnToIgnore(Pawn* pawnToIgnore) {
            this->pawnToIgnore = pawnToIgnore;
        }

        void setPiecesLoader(PiecesLoader* piecesLoader) {
            this->piecesLoader = piecesLoader;
        }

        void setPieces(PiecesDict* pieces) {
            this->pieces = pieces;
        }

        vector<PossibleMove*>* getPossibleMoves() {
            return &this->possibleMoves;
        }

        Pawn* getPawnToIgnore() {
            return this->pawnToIgnore;
        }

        PiecesLoader* getPiecesLoader() {
            return this->piecesLoader;
        }

        Config* getConfig() {
            return this->config;
        }

        PiecesDict* getPieces() {
            return this->pieces;
        }

        unique_ptr<GameState>& getGameState() {
            return this->gameState;
        }

        vector<Piece<RawPosition>*>* getPiecePtrs() {
            return this->piecePtrs;
        }

        void removePossibleMoves() {
            for (PossibleMove* possibleMove: this->possibleMoves) {
                delete possibleMove;
            }

            this->possibleMoves.clear();
        }

        /**
         * Called when a piece is selected, it shows its
         * possible moves or if it's the same as the
         * current selectedPiece, it deselects it.
         */
        void onPieceSelected(Piece<RawPosition>* piece) {
            this->removePossibleMoves();

            // Unselect piece if new selected piece
            // is the same as the previously selected
            if (std::addressof(this->selectedPiece) == std::addressof(piece)) {
                this->selectedPiece = nullptr;

                return;
            }

            this->selectedPiece = piece;

            vector<RawPosition> moves = this->selectedPiece->getPossibleMoves();

            for (RawPosition& move: moves) {
                PossibleMoveParams params = PossibleMoveParams();

                params.rawPosition   = &move;
                params.app           = this->app;
                params.config        = this->getConfig();
                params.boardBuilder  = this->boardBuilder;
                params.selectedPiece = this->selectedPiece;

                PossibleMove* possibleMove = new PossibleMove(&params);

                this->possibleMoves.push_back(possibleMove);
            }
        }

        ~GameControllerImpl() {
            this->removePossibleMoves();
        }
};

GameController::GameController(GameControllerParams* params):
    gameControllerImpl(make_unique<GameControllerImpl>(params))
{}

void GameController::render() {
    vector<PossibleMove*>* possibleMoves = this->gameControllerImpl->getPossibleMoves();

    for (PossibleMove* possibleMove: *possibleMoves) {
        possibleMove->render();
    }
}

void GameController::startGame() {
    PiecesDict* pieces = this->gameControllerImpl->getPieces();

    pieces->at(PieceColor::BLACK).at(Kind::ROOK)(0, 0);
    pieces->at(PieceColor::BLACK).at(Kind::KNIGHT)(1, 0);
    pieces->at(PieceColor::BLACK).at(Kind::BISHOP)(2, 0);
    pieces->at(PieceColor::BLACK).at(Kind::QUEEN)(3, 0);
    pieces->at(PieceColor::BLACK).at(Kind::KING)(4, 0);
    pieces->at(PieceColor::BLACK).at(Kind::BISHOP)(5, 0);
    pieces->at(PieceColor::BLACK).at(Kind::KNIGHT)(6, 0);
    pieces->at(PieceColor::BLACK).at(Kind::ROOK)(7, 0);

    for (int i = 0; i < 8; i++) {
        pieces->at(PieceColor::BLACK).at(Kind::PAWN)(i, 1);
    }

    pieces->at(PieceColor::WHITE).at(Kind::ROOK)(0, 7);
    pieces->at(PieceColor::WHITE).at(Kind::KNIGHT)(1, 7);
    pieces->at(PieceColor::WHITE).at(Kind::BISHOP)(2, 7);
    pieces->at(PieceColor::WHITE).at(Kind::QUEEN)(3, 7);
    pieces->at(PieceColor::WHITE).at(Kind::KING)(4, 7);
    pieces->at(PieceColor::WHITE).at(Kind::BISHOP)(5, 7);
    pieces->at(PieceColor::WHITE).at(Kind::KNIGHT)(6, 7);
    pieces->at(PieceColor::WHITE).at(Kind::ROOK)(7, 7);

    for (int i = 0; i < 8; i++) {
        pieces->at(PieceColor::WHITE).at(Kind::PAWN)(i, 6);
    }
}

/**
 * Called after the piece has moved to its desired
 * position, this updates the en passant state of
 * the pawns.
 */
void GameController::onPieceMoved() {
    this->gameControllerImpl->removePossibleMoves();

    vector<Piece<RawPosition>*>* piecePtrs = this->gameControllerImpl->getPiecePtrs();

    for (Piece<RawPosition>* piece: *piecePtrs) {
        // Only check for pawns
        if (!InstanceOf::check<Pawn>(piece)) continue;

        // Discard the pawn to ignore
        if (piece == this->gameControllerImpl->getPawnToIgnore()) continue;

        (static_cast<Pawn*>(piece))->updateEnPassantState(0, 0);
    }

    this->gameControllerImpl->setPawnToIgnore(nullptr);
    this->gameControllerImpl->setSelectedPiece(nullptr);

    // Print the contents of board in cout
    unique_ptr<GameState>& gameState = this->gameControllerImpl->getGameState();

    for (int row = 0; row < 8; row++) {
        for (int column = 0; column < 8; column++) {
            GetValidPieceResponse response = gameState->gameStateImpl->getValidPiece(column, row);

            if (response.piece == nullptr) {
                std::cout << "_____, ";
                continue;
            }

            if (InstanceOf::check<Pawn>(response.piece)) {
                std::cout << "Pawn, ";
            } else if (InstanceOf::check<Bishop>(response.piece)) {
                std::cout << "Bishop, ";
            } else if (InstanceOf::check<Knight>(response.piece)) {
                std::cout << "Knight, ";
            } else if (InstanceOf::check<Rook>(response.piece)) {
                std::cout << "Rook, ";
            } else if (InstanceOf::check<Queen>(response.piece)) {
                std::cout << "Queen, ";
            } else if (InstanceOf::check<King>(response.piece)) {
                std::cout << "King, ";
            }
        }

        std::cout << std::endl;
    }
}
