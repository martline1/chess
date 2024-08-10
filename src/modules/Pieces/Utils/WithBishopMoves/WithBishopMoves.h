#pragma once

#include <memory>

using std::unique_ptr;
using std::make_unique;

class WithBishopMoves {
    public:
        class WithBishopMovesImpl;
        unique_ptr<WithBishopMovesImpl> withBishopMovesImpl;

        WithBishopMoves();
};
