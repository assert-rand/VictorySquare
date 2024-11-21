cmake_minimum_required(VERSION 3.14)

set(This engine)

set(Headers
    board.hpp
    utils.hpp
)

set(Sources
    board.cpp
    utils.cpp
    main.cpp
)

add_executable(${This} ${Sources} ${Headers})