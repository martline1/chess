#pragma once

#include "Pawn.h"

#include "../../../Common/InstanceOf/InstanceOf.h"

Pawn::Pawn(PieceParams* params):
    Piece<RawPosition>(params)
{}

/**
 * En passant is a special pawn capture that can only occur
 * when these rules are met:
 * 
 * 1. The capturing pawn must have advanced exactly three
 * ranks to perform this move.
 * 2. The captured pawn must have moved two squares in one
 * move, landing right next to the capturing pawn.
 * 3. The en passant capture must be performed on the turn
 * immediately after the pawn being captured moves. If the
 * player does not capture en passant on that turn, they
 * no longer can do it later.
 */
bool Pawn::getEnPassant() {
    return this->enPassant;
}

/**
 * Updates en passant value determined by the en passant
 * rules.
 */
void Pawn::updateEnPassantState(int prevPosition, int newPosition) {
    if (!this->hasGoneEnPassant) {
        bool canGoEnPassant = abs(prevPosition - newPosition) == 2;

        if (canGoEnPassant) {
            this->enPassant = true;
            this->hasGoneEnPassant = true;
        }
    } else {
        this->enPassant = false;
    }
}

void Pawn::onMoveEnd(int column, int row) {
    RawPosition* rawPosition = this->pieceImpl->getRawPosition();
    GameController* gameController = this->pieceImpl->getGameController();

    this->updateEnPassantState(rawPosition->getRow(), row);

    gameController->gameControllerImpl->setPawnToIgnore(this);

    Piece::onMoveEnd(column, row);

    // // if pawn reached the end of the board, trigger a
    // // pawn promotion
    // if (rawPosition.row === 0 || rawPosition.row === 7) {
    //     this.controller.pieceSelectorModal.renderModal(this);
    // }
}

vector<RawPosition> Pawn::getPossibleMoves() {
    GameController* gameController = this->pieceImpl->getGameController();
    unique_ptr<GameState>& gameState = gameController->gameControllerImpl->getGameState();

    vector<RawPosition> moves = vector<RawPosition>();

    bool isWhite = this->pieceImpl->getColor() == PieceColor::WHITE;

    RawPosition* position = this->pieceImpl->getRawPosition();

    // Move forward
    int forward = (isWhite ? -1 : 1);

    int rowOfStart = (forward == 1 ? 1 : 6);

    int extraForward = (position->getRow() == rowOfStart
        ? forward
        : 0);

    int times = abs(forward + extraForward);

    for (int i = 1; i <= times; i++) {
        RawPosition nextPosition = RawPosition(
            position->getColumn(),
            position->getRow() + (i * forward)
        );

        GetValidPieceResponse response = gameState->gameStateImpl->getValidPiece(
            nextPosition.getColumn(),
            nextPosition.getRow()
        );

        if (response.isOutOfScope || InstanceOf::check<Piece<RawPosition>>(response.piece)) break;

        moves.push_back(nextPosition);
    }

    // Move diagonally to eat!
    RawPosition leftDiagonal  = RawPosition(position->getColumn() - 1, position->getRow() + forward);
    RawPosition rightDiagonal = RawPosition(position->getColumn() + 1, position->getRow() + forward);

    GetValidPieceResponse leftResponse  = gameState->gameStateImpl->getValidPiece(
        leftDiagonal.getColumn(),
        leftDiagonal.getRow()
    );
    GetValidPieceResponse rightResponse = gameState->gameStateImpl->getValidPiece(
        rightDiagonal.getColumn(),
        rightDiagonal.getRow()
    );

    if (
        !leftResponse.isOutOfScope
        && InstanceOf::check<Piece<RawPosition>>(leftResponse.piece)
        && leftResponse.piece->pieceImpl->getColor() != this->pieceImpl->getColor()
    ) {
        moves.push_back(leftDiagonal);
    }
    if (
        !rightResponse.isOutOfScope
        && InstanceOf::check<Piece<RawPosition>>(rightResponse.piece)
        && rightResponse.piece->pieceImpl->getColor() != this->pieceImpl->getColor()
    ) {
        moves.push_back(rightDiagonal);
    }

    // En Passant
    GetValidPieceResponse leftPawnResponse = gameState->gameStateImpl->getValidPiece(
        position->getColumn() - 1,
        position->getRow()
    );
    GetValidPieceResponse rightPawnResponse = gameState->gameStateImpl->getValidPiece(
        position->getColumn() + 1,
        position->getRow()
    );

    if (
        !leftPawnResponse.isOutOfScope
        && InstanceOf::check<Pawn>(leftPawnResponse.piece)
        && leftPawnResponse.piece->pieceImpl->getColor() != this->pieceImpl->getColor()
        && static_cast<Pawn*>(leftPawnResponse.piece)->getEnPassant()
    ) {
        RawPosition rawPosition = RawPosition();

        rawPosition.setRow(position->getRow() + forward);
        rawPosition.setColumn(position->getColumn() - 1);

        moves.push_back(rawPosition);
    }
    if (
        !rightPawnResponse.isOutOfScope
        && InstanceOf::check<Pawn>(rightPawnResponse.piece)
        && rightPawnResponse.piece->pieceImpl->getColor() != this->pieceImpl->getColor()
        && static_cast<Pawn*>(rightPawnResponse.piece)->getEnPassant()
    ) {
        RawPosition rawPosition = RawPosition();

        rawPosition.setRow(position->getRow() + forward);
        rawPosition.setColumn(position->getColumn() + 1);

        moves.push_back(rawPosition);
    }

    return moves;
}
