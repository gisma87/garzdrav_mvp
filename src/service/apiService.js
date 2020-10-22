class ApiService {

  // _apiBase = 'https://jsonplaceholder.typicode.com/photos';
  _apiBase = 'http://172.16.17.7:5000';

  // _apiBase = 'http://localhost:3000'

  async getResource(url = '') {
    const res = await fetch(`${this._apiBase}${url}`,
      {headers: {'accept': 'application/json'}}
    );
    if (!res.ok) {
      throw new Error(`Не могу выполнить fetch ${url}, статус ошибки: ${res.status}`)
    }
    return await res.json();
  }

  async getCities() {
    const res = await fetch('http://172.16.17.7:5000/Cities',
      {
        method: 'GET',
        headers: {
          accept: 'application/json'
        }
      }
    )
    if (!res.ok) {
      throw new Error(`Не могу выполнить fetch, статус ошибки: ${res.status}`)
    }
    return await res.json();
  }


  async getRetails() {
    return await this.getResource(`/Retails`);
  }

  async getPost(id) {
    return await this.getResource(`/${id}/`);
  }

  async getPosts() {
    return await this.getResource('?_limit=20')
  }

  async getPlanet(id) {
    const planet = await this.getResource(`/planets/${id}`)
    return this._transformPlanet(planet)
  }

  async getAllStarships() {
    const res = await this.getResource(`/starships/`);
    return res.results.map(this._transformStarship);
  }

  async getStarship(id) {
    const starship = await this.getResource(`/starships/${id}/`);
    return this._transformStarship(starship);
  }

  _extractId(item) {
    const idRegExp = /([0-9]*)\/$/;
    return item.url.match(idRegExp)[1]
  }

  _transformPhoto(photo) {
    return {
      title: photo.title,
      url: photo.thumbnailUrll
    }
  }

  _transformPlanet(planet) {
    return {
      id: this._extractId(planet),
      name: planet.name,
      population: planet.population,
      rotationPeriod: planet.rotation_period,
      diameter: planet.diameter
    }
  }

  _transformStarship(starship) {
    return {
      id: this._extractId(starship),
      name: starship.name,
      model: starship.model,
      manufacturer: starship.manufacturer,
      costInCredits: starship.costInCredits,
      length: starship.length,
      crew: starship.crew,
      passengers: starship.passengers,
      cargoCapacity: starship.cargoCapacity
    }
  }

  _transformPerson(person) {
    return {
      id: this._extractId(person),
      name: person.name,
      gender: person.gender,
      birthYear: person.birthYear,
      eyeColor: person.eyeColor
    }
  }

}

export default ApiService