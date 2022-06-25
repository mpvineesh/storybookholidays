import data from './data.json';

class DatService {
 
  constructor() {
    
  }

  async getContent(page, section, key) {
      let content = '';
      if(key && key!== '') {
            content = data[page][section][key];
      } else {
        content = data[page][section];
      }
      return content;
  }
  async getPackageDetails(packageName) {
    let packageData = {};
    let packages = data['packages'];
    packageData = packages.filter(p => p.packageName == packageName)[0];
    console.log('packageData', packageData, packages);
    return packageData;
  }

  async getPackages() {
    let packages = data['packages'];
   
    return packages;
  }


  async getFileData(name) {
    return fetch("packages/"+name+'.package')
  }
}



export default DatService;