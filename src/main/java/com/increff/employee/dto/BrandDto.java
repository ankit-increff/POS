package com.increff.employee.dto;

import com.increff.employee.pojo.BrandPojo;
import com.increff.employee.service.ApiException;
import com.increff.employee.service.BrandService;
import com.increff.employee.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.List;

@Component
public class BrandDto {

    @Autowired
    private BrandService service;

    //ADDING A BRAND
    @Transactional(rollbackOn = ApiException.class)
    public void add(BrandPojo p) throws ApiException {
        normalize(p);
        alreadyExistingCheck(p);
        if(StringUtil.isEmpty(p.getName()) || StringUtil.isEmpty(p.getCategory())) {
            throw new ApiException("name or category cannot be empty");
        }
        service.add(p);
    }

    //DELETING A BRAND
    @Transactional
    public void delete(int id) {
        service.delete(id);
    }

    //GETTING A BRAND
    @Transactional(rollbackOn = ApiException.class)
    public BrandPojo get(int id) throws ApiException {
        return getCheck(id);
    }

    //GETTING A BRAND BY NAME AND CATEGORY
    @Transactional(rollbackOn = ApiException.class)
    public List<BrandPojo> getByNameCategory(String name, String category) throws ApiException {
        return service.getByNameCategory(name,category);
    }

    //GETTING A BRAND BY NAME AND CATEGORY
    @Transactional(rollbackOn = ApiException.class)
    public BrandPojo get(String name, String category) throws ApiException {
        return getCheck(name, category);

    }

    //GET ALL BRANDS
    @Transactional
    public List<BrandPojo> getAll() {
        return service.getAll();
    }

    //UPDATE A BRAND
    @Transactional(rollbackOn  = ApiException.class)
    public void update(int id, BrandPojo p) throws ApiException {
        normalize(p);
        if(StringUtil.isEmpty(p.getName()) || StringUtil.isEmpty(p.getCategory())) {
            throw new ApiException("name or category cannot be empty");
        }
        BrandPojo ex = getCheck(id);
        alreadyExistingCheck(p);
        ex.setCategory(p.getCategory());
        ex.setName(p.getName());
//        dao.update(ex);
    }

    //CHECKS:------------------
    @Transactional
    public BrandPojo getCheck(int id) throws ApiException {
        BrandPojo p = service.get(id);
        if (p == null) {
            throw new ApiException("Brand with given ID does not exit, id: " + id);
        }
        return p;
    }

    @Transactional
    public BrandPojo getCheck(String name, String category) throws ApiException {
        BrandPojo p = service.get(name, category);
        if (p == null) {
            throw new ApiException("Brand with given name and category does not exists");
        }
        return p;
    }

    @Transactional
    public void alreadyExistingCheck(BrandPojo newPojo) throws ApiException {
        List<BrandPojo> arr = service.getAll();
        for(BrandPojo p: arr)
        {
            if(p.getName().equals(newPojo.getName()) && p.getCategory().equals(newPojo.getCategory()) ) {
                throw new ApiException("Brand with given name and category already exists");
            }
        }
    }

    protected static void normalize(BrandPojo p) {
        p.setName(StringUtil.toLowerCase(p.getName()));
        p.setCategory(StringUtil.toLowerCase(p.getCategory()));
    }
}
