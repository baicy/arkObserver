import axios from 'axios'
export function fetch(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, params)
      .then(
        res => resolve(res.data)
      )
      .catch(
        err => reject(err)
      );
  });
}

export function post(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(
        res => resolve(res.data)
      )
      .catch(
        err => reject(err)
      );
  });
}