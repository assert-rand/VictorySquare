cmake_minimum_required(VERSION 3.14)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)


project(chess_engine)


enable_testing()

add_subdirectory(googletest)

add_subdirectory(engine)
add_subdirectory(tests)