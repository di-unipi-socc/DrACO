# DrACO: Discovering Available Cloud Offerings
## About
This repository contains the source code of the implementation of the cloud offering discovery approach that has been presented in 
> _A. Brogi, P. Cifariello, J. Soldani <br>
> **[DrACO: Discovering Available Cloud Offerings.](http://dx.doi.org/10.1007/s00450-016-0332-5)** <br>
> Computer Science: Research and Development, Springer, 2016._ 

If you wish to reuse the sources in this repository, please properly cite the above mentioned paper. Below you can find the BibTex reference:
```
@article{DrACO,
  author = {Antonio Brogi and Paolo Cifariello and Jacopo Soldani},
  title = {{DrACO}: {D}iscovering {A}vailable {C}loud {O}fferings},
  journal = {Computer Science: Research and Development},
  volume = {},
  pages = {},
  year = {2016},
  note = {{\em [In Press]}},
  doi = {10.1007/s00450-016-0332-5}
}
```

## Running DrACO
The DrACO discoverer can be automatically installed on Unix machines, provided that they are equipped with a **bash** shell supporting the commands `maven` and `mongo`.

If this is the case, to install and start the DrACO discoverer just proceed as follows:
 1. Open a bash shell, 
 2. move to the folder where DrACO has been downloaded, and 
 3. type `sudo ./start.sh`.

Once DrACO is running, to stop it just type `sudo ./stop.sh`.
