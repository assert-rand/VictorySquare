## Victory Square

---
Subhajeet Lahiri, Harsh Kumar
---
DB-Config : 

```sh
docker run --name victorydb \
  -e MYSQL_ROOT_PASSWORD={password} \
  -v ~/Desktop/VictorySquare/data:/var/lib/mysql \
  -d mysql:latest
```


