CC = g++
CFLAGS = -Wall
LDFLAGS =
OBJFILES = utils.o board.o main.o
TARGET = test
all: $(TARGET)

$(TARGET): $(OBJFILES)
	$(CC) $(CFLAGS) -o $(TARGET) $(OBJFILES) $(LDFLAGS)
clean:
	rm -f $(OBJFILES) $(TARGET) *~