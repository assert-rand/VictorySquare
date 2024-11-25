package com.example.demo.controllers;

import com.example.demo.messages.SuccessResponse;
import com.example.demo.models.Game;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/game-service/game")
public class GameController {
    private final Map<String, Game> games = new ConcurrentHashMap<String, Game>();
    private final Map<String, String> ongoingGame = new ConcurrentHashMap<String, String>();

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/create")
    public ResponseEntity<String> createGame(@RequestParam String email, @RequestParam String otherEmail){
        if(email.equals(otherEmail)){
            return ResponseEntity.badRequest().build();
        }
        if(ongoingGame.containsKey(email)){
            return ResponseEntity.badRequest().build();
        }
        if(ongoingGame.containsKey(otherEmail)){
            return ResponseEntity.badRequest().build();
        }
        String gameId = UUID.randomUUID().toString();
        ongoingGame.put(email, gameId);

        String newFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        Game game = Game.builder()
                        .moveCount(0).whiteEmail(email).blackEmail(otherEmail).gameString(newFen).build();
        games.put(gameId, game);
        return ResponseEntity.ok(gameId);
    }

    @PutMapping("/accept")
    public ResponseEntity<String> acceptGame(@RequestParam String email, @RequestParam String otherEmail, @RequestParam String gameId, @RequestParam long notifId){
        if(!ongoingGame.containsKey(otherEmail)){
            return ResponseEntity.badRequest().build();
        }
        if(ongoingGame.containsKey(email)){
            return ResponseEntity.badRequest().build();
        }
        if(!ongoingGame.get(otherEmail).equals(gameId)){
            return ResponseEntity.badRequest().build();
        }
        Optional<User> optionalUser = userRepository.findById(email);
        if(optionalUser.isEmpty()){
            return ResponseEntity.badRequest().build();
        }
        User user = optionalUser.get();
        user.deleteNotification(notifId);
        ongoingGame.put(email, gameId);
        return ResponseEntity.ok(ongoingGame.get(email));
    }

    @PutMapping("/reject")
    public ResponseEntity<String> rejectGame(@RequestParam String email,@RequestParam String otherEmail, @RequestParam long notifId){
        Optional<User> optionalUser = userRepository.findById(email);
        if(optionalUser.isEmpty()){
            return ResponseEntity.badRequest().build();
        }
        User user = optionalUser.get();
        user.deleteNotification(notifId);
        userRepository.save(user);

        ongoingGame.remove(email);
        if(ongoingGame.containsKey(otherEmail)){
            games.remove(ongoingGame.get(otherEmail));
            ongoingGame.remove(otherEmail);
        }
        return ResponseEntity.ok(email);
    }


    @GetMapping("/state")
    public ResponseEntity<Game> getGameState(@RequestParam String id) {
        if(!games.containsKey(id)){
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(games.get(id));
    }

    @PatchMapping("/move")
    public ResponseEntity<SuccessResponse> move(@RequestParam String id, @RequestParam String state, @RequestParam String email){
        if(!games.containsKey(id)){
            return ResponseEntity.badRequest().build();
        }
        Game game = games.get(id);
        if(game.getMoveCount() % 2 == 0 && !email.equals(game.getWhiteEmail())){
            return ResponseEntity.badRequest().build();
        }
        if(game.getMoveCount() % 2 == 1 && !email.equals(game.getBlackEmail())){
            return ResponseEntity.badRequest().build();
        }
        game.setGameString(state);
        game.setMoveCount(game.getMoveCount() + 1);
        games.put(id, game);
        return ResponseEntity.ok(new SuccessResponse(true));
    }

    @DeleteMapping("/withdraw")
    public ResponseEntity<String> withdraw(@RequestParam String email, @RequestParam String otherEmail){
        String response = null;
        if(ongoingGame.containsKey(email)){
            String gameId = ongoingGame.get(email);
            ongoingGame.remove(email);
            if(games.containsKey(gameId)){
                response = gameId;
                games.remove(gameId);
            }
        }
        if(ongoingGame.containsKey(otherEmail)){
            String gameId = ongoingGame.get(otherEmail);
            ongoingGame.remove(otherEmail);
            games.remove(gameId);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/claim-victory")
    public ResponseEntity<String> claimVictory(@RequestParam String email, @RequestParam String otherEmail){
        if(ongoingGame.containsKey(email)){
            if(ongoingGame.containsKey(otherEmail)){
                String id1 = ongoingGame.get(email), id2 = ongoingGame.get(otherEmail);
                if(id1.equals(id2)){
                    games.remove(id1);
                    ongoingGame.remove(email);
                    ongoingGame.remove(otherEmail);

                    Optional<User> user1 = userRepository.findById(email);
                    Optional<User> user2 = userRepository.findById(otherEmail);

                    if(user1.isPresent() && user2.isPresent()) {
                        User newUser1 = user1.get();
                        User newUser2 = user2.get();
                        newUser1.setHumanGamesWon(newUser1.getHumanGamesWon() + 1);
                        newUser2.setHumanGamesLost(newUser2.getHumanGamesLost() + 1);
                        userRepository.save(newUser1);
                        userRepository.save(newUser2);
                    }
                }
            }
        }
        return ResponseEntity.badRequest().build();
    }
}

