#pragma once

#include "King.h"

#include "../../../Common/InstanceOf/InstanceOf.h"

King::King(PieceParams* params):
    CastlePiece(params)
{}

vector<RawPosition> King::getPossibleMoves() {
    return this->getPossibleMoves(false);
}

void King::updatePosition(RawPosition* rawPosition) {
    RawPosition* previousPosition = this->pieceImpl->getRawPosition();
    GameController* gameController = this->pieceImpl->getGameController();
    unique_ptr<GameState>& gameState = gameController->gameControllerImpl->getGameState();

    bool goingToRight = rawPosition->getColumn() > previousPosition->getColumn();

    // if the King moves two squares, this is a castle
    if (abs(previousPosition->getColumn() - rawPosition->getColumn()) == 2) {
            GetValidPieceResponse response = gameState->gameStateImpl->getValidPiece(
                goingToRight ? 7 : 0,
                this->getCorrespondingRow()
            );
        
        if (!response.isOutOfScope && InstanceOf::check<Rook>(response.piece)) {
            RawPosition newRookPosition = RawPosition(
                rawPosition->getColumn() + (goingToRight ? -1 : 1),
                this->getCorrespondingRow()
            );

            static_cast<Rook*>(response.piece)->updatePosition(&newRookPosition);
        }
    }

    // The King calls the super method because it
    // always lands on the correct position when castling!
    Piece::updatePosition(rawPosition);
}

vector<RawPosition> King::getPossibleMoves(bool disableCastle = false) {
    GameController* gameController = this->pieceImpl->getGameController();
    unique_ptr<GameState>& gameState = gameController->gameControllerImpl->getGameState();

    RawPosition* rawPosition = this->pieceImpl->getRawPosition();

    int column = rawPosition->getColumn();
    int row    = rawPosition->getRow();

    // Regular moves
    vector<RawPosition> possibleMoves = vector<RawPosition>();

    possibleMoves.push_back(RawPosition(column, row - 1)); // Top
    possibleMoves.push_back(RawPosition(column, row + 1)); // Bottom
    possibleMoves.push_back(RawPosition(column + 1, row)); // Right
    possibleMoves.push_back(RawPosition(column - 1, row)); // Left

    possibleMoves.push_back(RawPosition(column - 1, row - 1)); // Top left
    possibleMoves.push_back(RawPosition(column + 1, row + 1)); // Top right
    possibleMoves.push_back(RawPosition(column - 1, row + 1)); // Bottom left
    possibleMoves.push_back(RawPosition(column + 1, row - 1)); // Bottom right

    if (!disableCastle) {
        // Castle to the left if possible
        int leftRookOriginalColumn = 0;

        GetValidPieceResponse leftRook = gameState->gameStateImpl->getValidPiece(
            leftRookOriginalColumn,
            this->getCorrespondingRow()
        );

        bool thisIsTreatened = this->isTreatened();

        Rook* leftRookCasted = static_cast<Rook*>(leftRook.piece);

        bool canCastleToLeft =
            !this->getHasMoved()
            && !leftRook.isOutOfScope
            && InstanceOf::check<Rook>(leftRook.piece)
            && !leftRookCasted->getHasMoved()
            && !thisIsTreatened
            && this->checkIfEmptyAndSafe(3, 1) // Check left side
            && !leftRookCasted->isTreatened();

        if (canCastleToLeft) {
            possibleMoves.push_back(RawPosition(
                2,
                this->getCorrespondingRow()
            ));
        }

        // Castle to the right if possible
        bool rightRookOriginalColumn = 7;

        GetValidPieceResponse rightRook = gameState->gameStateImpl->getValidPiece(
            rightRookOriginalColumn,
            this->getCorrespondingRow()
        );
        
        Rook* rightRookCasted = static_cast<Rook*>(rightRook.piece);

        bool canCastleToRight =
            !this->getHasMoved()
            && InstanceOf::check<Rook>(rightRook.piece)
            && !rightRookCasted->getHasMoved()
            && !thisIsTreatened
            && this->checkIfEmptyAndSafe(5, 6) // Check right side
            && !rightRookCasted->isTreatened();
        
        if (canCastleToRight) {
            possibleMoves.push_back(RawPosition(
                6,
                this->getCorrespondingRow()
            ));
        }
    }

    return this->pieceImpl->filterValidMoves(possibleMoves);
}
