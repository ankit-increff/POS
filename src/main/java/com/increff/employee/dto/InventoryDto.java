package com.increff.employee.dto;

import com.increff.employee.model.InventoryData;
import com.increff.employee.model.InventoryForm;
import com.increff.employee.pojo.InventoryPojo;
import com.increff.employee.pojo.ProductPojo;
import com.increff.employee.service.ApiException;

import com.increff.employee.service.InventoryService;
import com.increff.employee.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Component
public class InventoryDto {

    @Autowired
    private InventoryService service;
    @Autowired
    private ProductService productService;

    @Transactional(rollbackOn = ApiException.class)
    public void increase(InventoryForm form) throws ApiException {
        InventoryPojo p = convert(form);
        InventoryPojo old = service.get(p.getId());
        //TODO to remove line 28 fetch the old inventory directly from barcode
        int totalQuantity = old.getQuantity()+Integer.parseInt(form.getQuantity());
        old.setQuantity(totalQuantity);
    }

    @Transactional(rollbackOn = ApiException.class)
    public InventoryData get(String barcode) throws ApiException {
        ProductPojo productPojo = productService.get(barcode);
        InventoryPojo p = service.get(productPojo.getId());
        return convert(p);
    }

    @Transactional(rollbackOn = ApiException.class)
    public List<InventoryData> getAll() throws ApiException {
        List<InventoryPojo> list = service.getAll();
        //TODO change variable names
        List<InventoryData> list2 = new ArrayList<InventoryData>();
        for (InventoryPojo p : list) {
            list2.add(convert(p));
        }
        return list2;
    }

    //TODO use proper function names (2 words)
    @Transactional(rollbackOn = ApiException.class)
    public void update(String barcode, InventoryForm f) throws ApiException {
        InventoryPojo p = convert(f);
        service.update(p.getId(), p);
    }


    private InventoryData convert(InventoryPojo p) throws ApiException {
        InventoryData d = new InventoryData();
        d.setQuantity(Integer.toString(p.getQuantity()));
        ProductPojo productPojo = productService.get(p.getId());
        d.setBarcode(productPojo.getBarcode());
        d.setName(productPojo.getName());

        return d;
    }

    private InventoryPojo convert(InventoryForm f) throws ApiException {
        if(Integer.parseInt(f.getQuantity()) < 0) {
            throw new ApiException("Quantity can't be negative!!");
        }

        InventoryPojo p = new InventoryPojo();
        p.setQuantity(Integer.parseInt(f.getQuantity()));

        ProductPojo productPojo = productService.get(f.getBarcode());
        if(productPojo==null) {
            throw new ApiException("Entered barcode doesn't exists!");
        }
        p.setId(productPojo.getId());

        return p;
    }

}
