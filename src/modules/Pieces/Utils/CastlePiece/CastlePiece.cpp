#pragma once

#include "CastlePiece.h"

#include "../../Utils/RawPosition/RawPosition.h"
#include "../../../Common/InstanceOf/InstanceOf.h"
#include "../../../Common/PieceColor/PieceColor.h"

CastlePiece::CastlePiece(PieceParams* params):
    HasMoved(params)
{}

bool CastlePiece::isTreatened() {
    vector<RawPosition> enemyMoves = this->getEnemyMoves(true);

    bool isTreatened = false;

    for (int i = 0; i < enemyMoves.size(); i++) {
        RawPosition* rawPosition = &enemyMoves.at(i);
        RawPosition* thisPosition = this->pieceImpl->getRawPosition();

        if (
            rawPosition->getColumn() == thisPosition->getColumn()
            && rawPosition->getRow() == thisPosition->getRow()
        ) {
            isTreatened = true;

            break;
        }
    }

    return isTreatened;
}

int CastlePiece::getCorrespondingRow() {
    return this->pieceImpl->getColor() == PieceColor::WHITE
        ? 7
        : 0;
}

/**
 * Determines wheter a row composed of positions
 * is empty and also is not treatened by enemy
 * pieces.
 */
bool CastlePiece::checkIfEmptyAndSafe(int fromInclusive, int toInclusive) {
    GameController* gameController = this->pieceImpl->getGameController();
    unique_ptr<GameState>& gameState = gameController->gameControllerImpl->getGameState();

    int min = std::min(fromInclusive, toInclusive);
    int max = std::max(fromInclusive, toInclusive);

    for (int i = min; i <= max; i++) {
        RawPosition position = RawPosition(
            i,
            this->getCorrespondingRow()
        );

        GetValidPieceResponse pieceResponse = gameState->gameStateImpl->getValidPiece(
            position.getColumn(),
            position.getRow()
        );
        
        if (InstanceOf::check<Piece<RawPosition>>(pieceResponse.piece)) return false; // Because not empty

        vector<RawPosition> enemyMoves = this->getEnemyMoves(true);

        for (int j = 0; j < enemyMoves.size(); j++) {
            RawPosition* possibleMove = &enemyMoves.at(j);

            if (
                possibleMove->getColumn() == position.getColumn()
                && possibleMove->getRow() == position.getRow()
            ) {
                return false; // Because not safe
            }
        }
    }

    return true;
}

vector<RawPosition> CastlePiece::getEnemyMoves(bool disableCastle = false) {
    vector<RawPosition> enemyMoves = vector<RawPosition>();

    GameController* gameController = this->pieceImpl->getGameController();
    vector<Piece<RawPosition>*>* piecePtrs = gameController->gameControllerImpl->getPiecePtrs();

    for (Piece<RawPosition>* piece: *piecePtrs) {
        // Search for enemy pieces, discard friendly ones
        if (piece->pieceImpl->getColor() == this->pieceImpl->getColor()) continue;

        if (InstanceOf::check<Rook>(piece)) {
            vector<RawPosition> possibleMoves = static_cast<Rook*>(piece)->getPossibleMoves(disableCastle);
            
            for (int i = 0; i < possibleMoves.size(); i++) {
                RawPosition possibleMove = possibleMoves.at(i);

                enemyMoves.push_back(possibleMove);
            }

            continue;
        }


        if (InstanceOf::check<King>(piece)) {
            vector<RawPosition> possibleMoves = static_cast<King*>(piece)->getPossibleMoves(disableCastle);
            
            for (int i = 0; i < possibleMoves.size(); i++) {
                RawPosition possibleMove = possibleMoves.at(i);

                enemyMoves.push_back(possibleMove);
            }

            continue;
        }

        vector<RawPosition> possibleMoves = piece->getPossibleMoves();

        for (int i = 0; i < possibleMoves.size(); i++) {
            RawPosition possibleMove = possibleMoves.at(i);

            enemyMoves.push_back(possibleMove);
        }
    }

    return enemyMoves;
}
