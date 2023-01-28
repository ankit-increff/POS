package com.increff.employee.service;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import static org.junit.Assert.assertEquals;

public class BrandServiceTest extends AbstractUnitTest{

    @Rule
    public ExpectedException expectedException = ExpectedException.none();


    @Test
    public void demoTest(){

        assertEquals("hello","hello");
    }
}
