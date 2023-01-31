package com.increff.employee.dto;

import com.increff.employee.model.BrandData;
import com.increff.employee.model.BrandForm;
import com.increff.employee.pojo.BrandPojo;
import com.increff.employee.service.ApiException;
import com.increff.employee.service.BrandService;
import com.increff.employee.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Component
public class BrandDto {

    @Autowired
    private BrandService service;

    //ADDING A BRAND
    @Transactional(rollbackOn = ApiException.class)
    public BrandPojo add(BrandForm f) throws ApiException {
        BrandPojo p = convert(f);
        normalize(p);
        alreadyExistingCheck(p);
        if(StringUtil.isEmpty(p.getName()) || StringUtil.isEmpty(p.getCategory())) {
            throw new ApiException("name or category cannot be empty");
        }
        return service.add(p);
    }

    //DELETING A BRAND
    @Transactional
    public void delete(int id) {
        service.delete(id);
    }

    //GETTING A BRAND
    @Transactional(rollbackOn = ApiException.class)
    public BrandData get(int id) throws ApiException {
        return convert(getCheck(id));
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
    public List<BrandData> getAll() {
        List<BrandPojo> list = service.getAll();
        List<BrandData> list2 = new ArrayList<BrandData>();
        for (BrandPojo p : list) {
            list2.add(convert(p));
        }
        return list2;
    }

    //UPDATE A BRAND
    @Transactional(rollbackOn  = ApiException.class)
    public BrandPojo update(int id, BrandForm f) throws ApiException {
        BrandPojo p = convert(f);
        normalize(p);
        if(StringUtil.isEmpty(p.getName()) || StringUtil.isEmpty(p.getCategory())) {
            throw new ApiException("Name or category cannot be empty");
        }
        BrandPojo ex = getCheck(id);
        alreadyExistingCheck(p);
        ex.setCategory(p.getCategory());
        ex.setName(p.getName());
        return ex;
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

    private static BrandData convert(BrandPojo p) {
        BrandData d = new BrandData();
        d.setCategory(p.getCategory());
        d.setName(p.getName());
        d.setId(p.getId());
        return d;
    }

    static BrandPojo convert(BrandForm f) {
        BrandPojo p = new BrandPojo();
        p.setCategory(f.getCategory());
        p.setName(f.getName());
        return p;
    }
}
