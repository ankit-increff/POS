package com.increff.employee.dto;

import com.increff.employee.model.ProductData;
import com.increff.employee.model.ProductForm;
import com.increff.employee.pojo.BrandPojo;
import com.increff.employee.pojo.ProductPojo;
import com.increff.employee.service.ApiException;
import com.increff.employee.service.BrandService;
import com.increff.employee.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Component
public class ProductDto {

    @Autowired
    private ProductService service;
    @Autowired
    private BrandService brandService;


    @Transactional(rollbackOn = ApiException.class)
    public ProductPojo add(ProductForm form) throws ApiException {
        ProductPojo p = convert(form);
        return service.add(p);
    }

    @Transactional(rollbackOn = ApiException.class)
    public ProductData get(int id) throws ApiException {
		ProductPojo p = service.get(id);
		return convert(p);
	}

    @Transactional(rollbackOn = ApiException.class)
    public ProductData getByBarcode(String barcode) throws ApiException {
		ProductPojo p = service.get(barcode);
		return convert(p);
	}

    @Transactional(rollbackOn = ApiException.class)
    public List<ProductData> getAll() throws ApiException {
		List<ProductPojo> list = service.getAll();
		List<ProductData> list2 = new ArrayList<ProductData>();
		for (ProductPojo p : list) {
			list2.add(convert(p));
		}
		return list2;
	}

    @Transactional(rollbackOn = ApiException.class)
    public ProductPojo update(int id, ProductForm f) throws ApiException {
        ProductPojo p = convert(f);
        return service.update(id, p);
    }


    private ProductData convert(ProductPojo p) throws ApiException {
        ProductData d = new ProductData();
        d.setName(p.getName());
        d.setId(p.getId());
        d.setBarcode(p.getBarcode());
        d.setMrp(Double.toString(p.getMrp()));

        BrandPojo brand = brandService.get(p.getBrandId());
        d.setBrand(brand.getName());
        d.setCategory(brand.getCategory());

        return d;
    }

    private ProductPojo convert(ProductForm f) throws ApiException {
        if(Double.parseDouble(f.getMrp()) < 0) {
            throw new ApiException("MRP can't be negative!!");
        }

        ProductPojo p = new ProductPojo();
        p.setName(f.getName());
        p.setBarcode(f.getBarcode());
        p.setMrp(Double.parseDouble(f.getMrp()));
        BrandPojo bp = brandService.get(f.getBrand(), f.getCategory());

        p.setBrandId(bp.getId());
        return p;
    }

}
